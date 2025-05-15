// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client directly in this file
const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const updateData = await request.json();
    console.log('Backend received updateData:', updateData);

    const ride = await prisma.ride.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    let updatedRide;

    if (Object.keys(updateData).length === 1 && updateData.status !== undefined) {
      updatedRide = await prisma.ride.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          status: updateData.status,
        },
      });
      return NextResponse.json({ message: 'Ride status updated successfully', updatedRide });
    } else {
      updatedRide = await prisma.ride.update({
        where: {
          id: parseInt(id, 10),
        },
        data: updateData,
      });
      return NextResponse.json({ message: 'Ride updated successfully', updatedRide });
    }

  } catch (error: any) {
    console.error('Error updating ride:', error);
    return NextResponse.json({ error: 'Failed to update ride' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}