import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rides = await prisma.ride.findMany({
      include: {
        customer: true,
        addrStart: true,
        addrEnd: true,
        volunteer: {
          include: {
            user: true,
          },
        },
      },
    });

    // Format rides to match what the components expect
    const formattedRides = rides.map(ride => ({
      id: ride.id,
      customerName: ride.customer 
        ? `${ride.customer.firstName} ${ride.customer.lastName}` 
        : '',
      phoneNumber: ride.customer?.customerPhone || '',
      startAddress: ride.addrStart 
        ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` 
        : '',
      startTime: ride.pickupTime,
      volunteerName: ride.volunteer?.user 
        ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` 
        : '',
      status: ride.status,
      date: ride.date,
      // Include original data in case it's needed
      _original: ride,
    }));

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Failed to fetch rides' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}