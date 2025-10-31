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
        status: true,
      },
    });

    const formattedRides = rides.map((ride) => {
      // Extract just the time portion from pickupTime DateTime
      const pickupDate = new Date(ride.pickupTime);
      const hours = pickupDate.getHours().toString().padStart(2, '0');
      const minutes = pickupDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      return {
        id: ride.id,
      
        // ID constants
        customerID: ride.customerID,
        startAddressID: ride.startAddressID,
        endAddressID: ride.endAddressID,
        volunteerID: ride.volunteerID,
      
        // Customer data
        customerName: `${ride.customer.firstName} ${ride.customer.lastName}`,
        customerPhone: ride.customer.customerPhone,
        phoneNumber: ride.customer.customerPhone, // Duplicate for compatibility
        
        // Address data
        startAddress: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
        startLocation: `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`,
        endAddress: ride.addrEnd ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` : '',
        endLocation: ride.addrEnd ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` : '',
        
        // Volunteer data
        volunteerName: ride.volunteer?.user 
          ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` 
          : '',
        
        // Date/Time data - keep as ISO strings for proper parsing
        date: ride.date.toISOString(),
        startTime: timeString, // Just HH:MM format
        
        // Status
        status: ride.status,
      };
    });

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}