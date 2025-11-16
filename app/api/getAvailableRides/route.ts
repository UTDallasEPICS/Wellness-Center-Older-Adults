import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma-client';

 

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
        customerID: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            customerPhone: true,
          },
        },
        startAddressID: true,
        addrStart: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        endAddressID: true,
        addrEnd: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        volunteerID: true,
        volunteer: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        date: true,
        pickupTime: true,
        totalTime: true,
        waitTime: true,
        specialNote: true,
        status: true,
      },
    });

    const formattedRides = rides.map((ride) => ({
      id: ride.id,
    
      // ID constants
      customerID: ride.customerID,
      startAddressID: ride.startAddressID,
      endAddressID: ride.endAddressID,
      volunteerID: ride.volunteerID,
    
      // Editable data
      customerName: `${ride.customer.firstName} ${ride.customer.lastName}`,
      phoneNumber: ride.customer.customerPhone,
      customerPhone: ride.customer.customerPhone,
      startAddress: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
      startLocation: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
      endLocation: `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}`,
      volunteerName: ride.volunteer?.user 
        ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` 
        : '',
      date: ride.date.toISOString(),
      startTime: ride.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      totalTime: ride.totalTime || '',
      waitTime: typeof ride.waitTime === 'number' ? ride.waitTime : 0,
      status: ride.status,
    }));

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}