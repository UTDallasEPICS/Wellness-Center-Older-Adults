// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client (consider using a global singleton for production)
const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await request.json();

  try {
    // 1. Find the ride by ID using Prisma
    const ride = await prisma.ride.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    // 2. Update the ride status using Prisma
    const updatedRide = await prisma.ride.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        status: status,
      },
    });

    // 3. Return a success response
    return NextResponse.json({ message: 'Ride status updated successfully', updatedRide });

  } catch (error: any) {
    console.error('Error updating ride status:', error);
    return NextResponse.json({ error: 'Failed to update ride' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}