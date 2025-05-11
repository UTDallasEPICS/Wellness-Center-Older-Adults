import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const volunteerId = parseInt(params.id, 10);

  if (isNaN(volunteerId)) {
    return NextResponse.json({ status: 400, message: 'Invalid volunteer ID' }, { status: 400 });
  }

  try {
    const existingVolunteer = await prisma.volunteerInfo.findUnique({
      where: {
        VolunteerID: volunteerId,
      },
    });

    if (!existingVolunteer) {
      return NextResponse.json({ status: 404, message: 'Volunteer not found' }, { status: 404 });
    }

    await prisma.volunteerInfo.delete({
      where: {
        VolunteerID: volunteerId,
      },
    });

    // Optionally, archive the associated user
    if (existingVolunteer.userID) {
      await prisma.user.update({
        where: { id: existingVolunteer.userID },
        data: { isArchived: true },
      });
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