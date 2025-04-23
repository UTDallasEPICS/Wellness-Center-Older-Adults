import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = cookies();
  const cvuser = cookieStore.get('cvuser')?.value;
  if (!cvuser) {
    return NextResponse.json(
      { error: 'Token not found or user not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Fetch the user's role from the database using cvuser as the user ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(cvuser) },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    );
  }
}