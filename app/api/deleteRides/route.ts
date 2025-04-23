import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const rideId = parseInt(params.id, 10); // Convert the ride ID from string to number

  if (isNaN(rideId)) {
    return new Response(
      JSON.stringify({ status: 400, message: 'Invalid ride ID' }),
      { status: 400 }
    );
  }

  try {
    // Update the ride to set isArchived to true
    await prisma.ride.update({
      where: { id: rideId },
      data: { isArchived: true },
    });

    return new Response(
      JSON.stringify({ status: 200, message: 'Ride archived successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error archiving ride:', error);

    // Handle cases where the ride does not exist
    /*
    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ status: 404, message: 'Ride not found' }),
        { status: 404 }
      );
    }
    */
    return new Response(
      JSON.stringify({ status: 500, message: 'Internal Server Error' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
}