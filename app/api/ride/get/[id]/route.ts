// app/api/ride/get/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import mockData from '../../../../mockdata/mock-data-new';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ride ID' }, { status: 400 });
    }

    // Find the ride in the mock data
    const ride = mockData.find((r) => r.id === parsedId);

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    const formattedRide = {
      id: ride.id,
      pickupAddress: ride.addrStart ? ride.addrStart.street : 'N/A',
      dropoffAddress: ride.addrEnd ? ride.addrEnd.street : 'N/A',
      pickupTime: ride.pickupTime,
      customer: ride.customer ? { name: ride.customer.firstName + ' ' + ride.customer.lastName } : { name: 'N/A' },
      mileage: 'N/A',
      status: ride.status,
      driveTimeAB: 'N/A',
      driveTimeBC: 'N/A',
      waitTime: 'N/A',
    };

    return NextResponse.json(formattedRide);
  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}