import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      // find our volunteer by unique id
      select: {
        //what information do we want?
        VolunteerID: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
      },
    });

    return NextResponse.json(volunteers); // if found return volunteer model
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}