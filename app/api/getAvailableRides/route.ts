import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return NextResponse.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  try {
    const rides = await prisma.ride.findMany({
      select: {
        id: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            customerPhone: true,
          },
        },
        addrStart: {
          select: {
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        addrEnd: {
          select: {
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        date: true,
        pickupTime: true,
        status: true, // Include the status in the fetched data
      },
    });

    const formattedRides = rides.map((ride) => ({
      id: ride.id,
      customerName: `${ride.customer.firstName} ${ride.customer.lastName}`,
      customerPhone: ride.customer.customerPhone,
      startLocation: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
      endLocation: `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}`,
      date: ride.date.toISOString(), // Convert Date to ISO string
      startTime: ride.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), // Format time as HH:MM
      status: ride.status, // Include the status in the formatted data
    }));

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}