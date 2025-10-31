import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Client, DistanceMatrixResponse, DistanceMatrixRequest } from '@googlemaps/google-maps-services-js';

const prisma = new PrismaClient();
const googleMapsClient = new Client({});

// Utility function to handle Google Maps API call
const getDistanceMatrix = async (req: DistanceMatrixRequest): Promise<DistanceMatrixResponse> => {
  try {
    const response = await googleMapsClient.distancematrix(req);
    return response;
  } catch (error: any) {
    throw new Error(`Google Maps API error: ${error.message}`, { cause: error });
  }
};

// GET - Fetch ride details with distance/time calculation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ride ID' }, { status: 400 });
    }

    const ride = await prisma.ride.findUnique({
      where: { id: parsedId },
      include: {
        customer: { include: { address: true } },
        addrStart: true,
        addrEnd: true,
      },
    });

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    const origin = ride.addrStart
      ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`
      : '';
    const destination = ride.addrEnd
      ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}`
      : '';

    let driveTimeAB = 'N/A';
    let mileage = 'N/A';

    if (origin && destination) {
      try {
        const distanceMatrixAB = await getDistanceMatrix({
          params: {
            origins: [origin],
            destinations: [destination],
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
            units: 'imperial',
          },
          timeout: 5000,
        });

        const element = distanceMatrixAB.data?.rows?.[0]?.elements?.[0];
        driveTimeAB = element?.duration?.text || 'N/A';
        const mileageText = element?.distance?.text;
        mileage = mileageText ? (mileageText.includes('mi') ? mileageText : `${mileageText} mi`) : 'N/A';
      } catch (error: any) {
        console.error('Error fetching distance matrix:', error);
        driveTimeAB = 'N/A';
        mileage = 'N/A';
      }
    }

    // Extract just the time portion from pickupTime DateTime
    const pickupDate = new Date(ride.pickupTime);
    const hours = pickupDate.getHours().toString().padStart(2, '0');
    const minutes = pickupDate.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const formattedRide = {
      id: ride.id,
      pickupAddress: origin || 'N/A',
      dropoffAddress: destination || 'N/A',
      pickupTime: timeString, // HH:MM format
      customer: ride.customer ? { name: `${ride.customer.firstName} ${ride.customer.lastName}` } : { name: 'N/A' },
      mileage,
      status: ride.status,
      driveTimeAB,
      totalTime: ride.totalTime,
      notes: ride.specialNote,
      date: ride.date.toISOString(),
    };

    return NextResponse.json(formattedRide);
  } catch (error: any) {
    console.error('Error fetching ride details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}