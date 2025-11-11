import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RideRequestBody {
  customerId: number;
  pickupStreet: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  destinationStreet: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  pickUpTime: string;
  date: string;
  extraInfo: string;
}

// POST - Create a new ride
export async function POST(req: Request) {
  try {
    const {
      customerId,
      pickupStreet,
      pickupCity,
      pickupState,
      pickupZip,
      destinationStreet,
      destinationCity,
      destinationState,
      destinationZip,
      pickUpTime,
      date,
      extraInfo,
    } = (await req.json()) as RideRequestBody;

    // Find the Customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { status: 400, message: 'Customer not found' },
        { status: 400 }
      );
    }

    const pickupDateTime = new Date(date);
    const [hours, minutes] = pickUpTime.split(':').map(Number);
    pickupDateTime.setHours(hours, minutes, 0, 0);

    // Use a transaction to ensure atomicity
    const createdRide = await prisma.$transaction(async (tx) => {
      // Check if pickup address exists
      let startAddress = await tx.address.findFirst({
        where: {
          street: pickupStreet,
          city: pickupCity,
          state: pickupState,
          postalCode: pickupZip,
        },
      });

      if (!startAddress) {
        startAddress = await tx.address.create({
          data: {
            street: pickupStreet,
            city: pickupCity,
            state: pickupState,
            postalCode: pickupZip,
          },
        });
      }

      // Check if destination address exists
      let endAddress = await tx.address.findFirst({
        where: {
          street: destinationStreet,
          city: destinationCity,
          state: destinationState,
          postalCode: destinationZip,
        },
      });

      if (!endAddress) {
        endAddress = await tx.address.create({
          data: {
            street: destinationStreet,
            city: destinationCity,
            state: destinationState,
            postalCode: destinationZip,
          },
        });
      }

      // Create the Ride record
      const ride = await tx.ride.create({
        data: {
          customerID: customer.id,
          date: pickupDateTime,
          pickupTime: pickupDateTime,
          startAddressID: startAddress.id,
          endAddressID: endAddress.id,
          specialNote: extraInfo,
          volunteerID: 1, // Replace with your dynamic logic
        },
      });
      return ride;
    });

    return NextResponse.json(
      { status: 201, message: 'Ride created successfully', data: createdRide },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ride:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to create ride due to a database error',
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Fetch all rides
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
    const formattedRides = rides.map(ride => {
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
        customerName: ride.customer 
          ? `${ride.customer.firstName} ${ride.customer.lastName}` 
          : '',
        customerPhone: ride.customer?.customerPhone || '',
        phoneNumber: ride.customer?.customerPhone || '',
        
        // Address data
        startAddress: ride.addrStart 
          ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` 
          : '',
        startLocation: ride.addrStart 
          ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` 
          : '',
        endAddress: ride.addrEnd 
          ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` 
          : '',
        endLocation: ride.addrEnd 
          ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` 
          : '',
        
        // Volunteer data
        volunteerName: ride.volunteer?.user 
          ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` 
          : '',
        
        // Date/Time data
        date: ride.date.toISOString(),
        startTime: timeString, // Just HH:MM format
        
        // Status
        status: ride.status,
      };
    });

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rides' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}