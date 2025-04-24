import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EditVolunteerParams {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  try {
    const { id, firstName, lastName, email, phone } = (await req.json()) as EditVolunteerParams;

    const existingVolunteer = await prisma.volunteerInfo.findUnique({
      where: {
        id,
      },
    });

    if (!existingVolunteer) {
      return Response.json({
        status: 404,
        message: 'Volunteer not found',
      });
    }

    const existingEmailUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: existingVolunteer.userID,
        },
      },
    });

    if (existingEmailUser) {
      return Response.json({
        status: 409,
        message: 'Email is already in use by another user',
      });
    }

    const existingPhoneUser = await prisma.user.findFirst({
      where: {
        phone,
        NOT: {
          id: existingVolunteer.userID,
        },
      },
    });

    if (existingPhoneUser) {
      return Response.json({
        status: 409,
        message: 'Phone number is already in use by another user',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: existingVolunteer.userID,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    return Response.json({
      status: 200,
      message: 'Volunteer updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}
