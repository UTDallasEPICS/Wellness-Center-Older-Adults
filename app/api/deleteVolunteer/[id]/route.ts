// app\api\deleteVolunteer\[id]\route.ts
//import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from "../../../../util/prisma-client";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const volunteerId = parseInt(params.id, 10);

  if (isNaN(volunteerId)) {
    return NextResponse.json({ status: 400, message: 'Invalid volunteer ID' }, { status: 400 });
  }

  try {
    const existingVolunteer = await prisma.volunteerInfo.findUnique({
      where: {
        id: volunteerId, // Use 'id' to match your schema
      },
      include: {
        user: true, // Include the associated user for easier access
      },
    });

    if (!existingVolunteer) {
      return NextResponse.json({ status: 404, message: 'Volunteer not found' }, { status: 404 });
    }

    await prisma.volunteerInfo.delete({
      where: {
        id: volunteerId, // Use 'id'
      },
    });

    // Archive the associated user if it exists
    if (existingVolunteer.user) {
      try {
        await prisma.user.update({
          where: { id: existingVolunteer.user.id },
          data: { isArchived: true },
        });
      } catch (userUpdateError: any) {
        console.error('Error archiving user:', userUpdateError);
      }
    }

    return NextResponse.json({ status: 200, message: 'Volunteer deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting volunteer:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ status: 404, message: 'Volunteer not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}