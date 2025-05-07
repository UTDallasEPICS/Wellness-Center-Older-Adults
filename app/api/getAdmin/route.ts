// app/api/getAdmin/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch admin users from the database where isAdmin is true
    const admins = await prisma.user.findMany({
      where: {
        isAdmin: true,
      },
    });

    return NextResponse.json(admins, { status: 200 });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins from the database' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}