import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { Client, DistanceMatrixResponse, DistanceMatrixRequest, UnitSystem } from '@googlemaps/google-maps-services-js';

const prisma = new PrismaClient();
const googleMapsClient = new Client({});

// Utility function to handle Google Maps API call
const getDistanceMatrix = async (req: DistanceMatrixRequest): Promise<DistanceMatrixResponse> => {
    try {
        const response = await googleMapsClient.distancematrix(req);
        return response;
    } catch (error: any) {
        // Improved error handling: Wrap the error and provide context.
        throw new Error(`Google Maps API error: ${error.message}`, { cause: error });
    }
};

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
            where: {
                id: parsedId,
            },
            include: {
                customer: {
                    include: {
                        address: true,
                    },
                },
                addrStart: true,
                addrEnd: true,
            },
        });

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        // Construct origin and destination strings
        const origin = ride.addrStart
            ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}`
            : '';
        const destination = ride.addrEnd
            ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}`
            : '';

        let driveTimeAB = 'N/A';
        let mileage = 'N/A';

        // Only call Google Maps if we have both origin and destination
        if (origin && destination) {
            try {
                const distanceMatrixAB = await getDistanceMatrix({
                    params: {
                        origins: [origin],
                        destinations: [destination],
                        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Ensure key is provided
                        units: UnitSystem.imperial,
                    },
                    timeout: 5000, // Increased timeout to 5 seconds
                });

                // Refactor: Simplify access and handle missing elements robustly
                const element = distanceMatrixAB.data?.rows?.[0]?.elements?.[0];
                driveTimeAB = element?.duration?.text || 'N/A';
                const mileageText = element?.distance?.text;
                mileage = mileageText ? (mileageText.includes('mi') ? mileageText : `${mileageText} mi`) : 'N/A';
            } catch (error: any) {
                // Handle Google Maps API errors gracefully.  Log the error and set to N/A
                console.error('Error fetching distance matrix:', error);
                driveTimeAB = 'N/A';
                mileage = 'N/A';
            }
        }

        // Format the ride data
        const formattedRide = {
            id: ride.id,
            pickupAddress: origin || 'N/A', // Use the origin/destination variables
            dropoffAddress: destination || 'N/A',
            pickupTime: ride.pickupTime,
            customer: ride.customer ? { name: `${ride.customer.firstName} ${ride.customer.lastName}` } : { name: 'N/A' },
            mileage,
            status: ride.status,
            driveTimeAB,
            notes: ride.specialNote,
            date: ride.date,
        };

        return NextResponse.json(formattedRide);
    } catch (error: any) {
        // Catch any errors in the  try block
        console.error('Error fetching ride details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

