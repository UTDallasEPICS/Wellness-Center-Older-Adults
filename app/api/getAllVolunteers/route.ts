import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try{
    const volunteers = await prisma.volunteer.findMany({ // find our volunteer by unique id
      select: { //what information do we want?
        volunteerFname: true,
        volunteerLname: true,
        volunteerEmail: true,
        volunteerPhone: true,
        volunteerStatus: true,
      },
    });


    if(!volunteers || volunteers.length === 0) { // if volunteer not found return error
      return NextResponse.json({ error: 'No volunteers found' }, { status: 404 });
    }

    return NextResponse.json(volunteers); // if found return volunteer model

  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500});
  }
}