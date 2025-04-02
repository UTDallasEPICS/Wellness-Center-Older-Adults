import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';

const prisma = new PrismaClient();
const googleMapsClient = new Client({});

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

        // Google Maps Distance Matrix API calls
        const distanceMatrixAB = await googleMapsClient.distancematrix({
            params: {
                origins: [`${ride.addrStart?.street}, ${ride.addrStart?.city}, ${ride.addrStart?.state}, ${ride.addrStart?.postalCode}`], // Added postalCode
                destinations: [`${ride.addrEnd?.street}, ${ride.addrEnd?.city}, ${ride.addrEnd?.state}, ${ride.addrEnd?.postalCode}`], // Added postalCode
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                units: 'imperial',
            },
            timeout: 1000,
        });

        const driveTimeAB = distanceMatrixAB.data.rows[0].elements[0].duration?.text || 'N/A';
        const mileageText = distanceMatrixAB.data.rows[0].elements[0].distance?.text || 'N/A';
        const mileage = mileageText.includes('mi') ? mileageText : mileageText + " mi";

        // Format the ride data as needed
        const formattedRide = {
            id: ride.id,
            pickupAddress: ride.addrStart ? ride.addrStart.street : 'N/A',
            dropoffAddress: ride.addrEnd ? ride.addrEnd.street : 'N/A',
            pickupTime: ride.pickupTime,
            customer: ride.customer ? { name: ride.customer.firstName + ' ' + ride.customer.lastName } : { name: 'N/A' },
            mileage: mileage,
            status: ride.status,
            driveTimeAB: driveTimeAB,
            driveTimeBC: 'N/A',
            waitTime: 'N/A',
        };

        return NextResponse.json(formattedRide);
    } catch (error) {
        console.error('Error fetching ride:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}