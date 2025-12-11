import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const volunteers = await prisma.volunteerInfo.findMany({
      where: {
        user: {
          isArchived: false, // Only fetch active users
        },
      },
      select: {
        id: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        status: true,
        rides: {
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
      },
    });

    const formattedVolunteers = volunteers.map(volunteer => ({
      id: volunteer.id,
      firstName: volunteer.user.firstName,
      lastName: volunteer.user.lastName,
      email: volunteer.user.email,
      phone: volunteer.user.phone,
      role: volunteer.user.role,
      status: volunteer.status,
      rides: volunteer.rides.map(ride => ({
        id: ride.id,
        date: ride.date,
        status: ride.status,
      })),
    }));

    return NextResponse.json(formattedVolunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
