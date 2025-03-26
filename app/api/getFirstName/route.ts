import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { jwtVerify, importX509 } from 'jose';

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = cookies();
  const cvtoken = cookieStore.get('cvtoken')?.value;
  if (!cvtoken) {
    return NextResponse.json(
      { error: 'Token not found or user not authenticated' },
      { status: 401 }
    );
  }

  const certPem = process.env.CERT_PEM;
  if (!certPem) {
    return NextResponse.json(
      { error: 'Certificate not found in environment variables' },
      { status: 500 }
    );
  }

  let key;
  try {
    key = await importX509(certPem, 'RS256');
  } catch (error) {
    console.error('Error importing certificate:', error);
    return NextResponse.json({ error: 'Failed to import certificate' }, { status: 500 });
  }

  let decoded;
  try {
    decoded = await jwtVerify(cvtoken, key);
  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const email = decoded.payload.email as string;

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: { firstName: true },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Welcome, ${admin.firstName}!` });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}