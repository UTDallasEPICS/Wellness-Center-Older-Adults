import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Note: This is where you would get the authenticated volunteer's ID.
    // For now, let's assume you have a way to get the volunteer's ID.
    // In a real application, this would come from a session or token.
    const volunteerId = 1; 

    // Find the VolunteerInfo record, then include the associated User and Rides
    const volunteerInfo = await prisma.volunteerInfo.findUnique({
      where: {
        id: volunteerId,
      },
      include: {
        user: true, // This fetches the related User data
        rides: {
          where: { isArchived: false },
          include: {
            addrStart: true,
            addrEnd: true,
          },
        },
      },
    });

    if (!volunteerInfo) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    // Now, `volunteerInfo.user` contains all the user's details
    const user = volunteerInfo.user;

    const userData = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      username: user.email,
      birthdate: user.birthdate,
      profilePicUrl: user.profilePicUrl, 
      
      // Volunteer-specific data
      isVolunteer: true,
      volunteerStatus: volunteerInfo.status,
      assignedRides: volunteerInfo.rides || [],
    };

    return NextResponse.json({ user: userData });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
