import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma-client';

 

export async function GET() {
  try {
    // Fetch the first volunteer (or change logic as needed)
    const volunteerInfo = await prisma.volunteerInfo.findFirst({
      include: {
        user: true,
      },
    });

    if (!volunteerInfo || !volunteerInfo.user) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    // Combine user and volunteerInfo fields for frontend
    const volunteer = {
      firstName: volunteerInfo.user.firstName,
      lastName: volunteerInfo.user.lastName,
      email: volunteerInfo.user.email,
      phone: volunteerInfo.user.phone,
      status: volunteerInfo.status,
    };

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}