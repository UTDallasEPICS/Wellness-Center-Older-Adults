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
      where: {
        status: 'AVAILABLE',
        // NOTE: EVENTUALLY YOU SHOULD ALSO LOOK FOR RIDES THAT ARE CONNECTED TO THE ID OF
        // THE VOLUNTEER SHOULD ALSO BE ABLE TO SEE WHAT RIDES THEY HAVE RESERVED
      },
      select: {
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
      },
    });

    const formattedRides = rides.map((ride: {
      customer: { firstName: string; lastName: string; customerPhone: string };
      addrStart: { street: string; city: string; state: string; postalCode: string };
      addrEnd: { street: string; city: string; state: string; postalCode: string };
      date: string;
      pickupTime: string;
    }) => ({
      customerName: `${ride.customer.firstName} ${ride.customer.lastName}`,
      customerPhone: ride.customer.customerPhone,
      startLocation: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
      endLocation: `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}`,
      date: ride.date,
      startTime: ride.pickupTime,
    }));

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
