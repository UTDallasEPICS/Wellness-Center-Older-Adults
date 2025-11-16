//import { PrismaClient } from '@prisma/client';
import prisma from "../../../../util/prisma-client";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const rideId = parseInt(params.id, 10); // Convert the ride ID from string to number

  if (isNaN(rideId)) {
    return new Response(
      JSON.stringify({ status: 400, message: 'Invalid ride ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } } // Added Content-Type
    );
  }

  try {
    // Delete the ride
    const deletedRide = await prisma.ride.delete({
      where: { id: rideId },
    });

    if (deletedRide) {
      return new Response(
        JSON.stringify({ status: 200, message: 'Ride deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } } // Added Content-Type
      );
    } else {
      return new Response(
        JSON.stringify({ status: 404, message: 'Ride not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } } // Added Content-Type
      );
    }
  } catch (error: any) {
    console.error('Error deleting ride:', error);

    // Handle cases where the ride does not exist (Prisma might throw an error)
    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ status: 404, message: 'Ride not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } } // Added Content-Type
      );
    }

    return new Response(
      JSON.stringify({ status: 500, message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } } // Added Content-Type
    );
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
}