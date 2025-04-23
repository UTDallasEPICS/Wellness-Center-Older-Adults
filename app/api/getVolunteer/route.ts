import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      // find our volunteer by unique id
      where: {
        // looking where to find our target based on id
        VolunteerID: 1, //for now this should change later to just go through all the ids probably
      },
      select: {
        //what information do we want?
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
      },
    });

    if (!volunteer) {
      // if volunteer not found return error
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json(volunteer); // if found return volunteer model
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}