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
        date: true,
        pickupTime: true,
        status: true,
        volunteer: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

  const formattedRides = rides.map((ride) => ({
    id: ride.id,
    clientName: ride.customer ? `${ride.customer.firstName} ${ride.customer.lastName}` : '',
    phoneNumber: ride.customer?.customerPhone || '',
    address: ride.addrStart ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` : '',
    startTime: ride.pickupTime ? ride.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
    volunteerName: ride.volunteer && ride.volunteer.user ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` : '',
    status: ride.status,
  }));

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}