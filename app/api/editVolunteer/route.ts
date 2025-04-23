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

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: {
        VolunteerID: id,
      },
    });

    if (!existingVolunteer) {
      return Response.json({
        status: 404,
        message: 'Volunteer not found',
      });
    }

    const existingEmailVolunteer = await prisma.volunteer.findFirst({
      where: {
        email: email,
        NOT: {
          VolunteerID: id,
        },
      },
    });

    if (existingEmailVolunteer && existingEmailVolunteer.VolunteerID !== id) {
      return Response.json({
        status: 409,
        message: 'Email is already in use by another volunteer',
      });
    }

    const existingPhoneVolunteer = await prisma.volunteer.findFirst({
      where: {
        phone: phone,
        NOT: {
          VolunteerID: id,
        },
      },
    });

    if (existingPhoneVolunteer && existingPhoneVolunteer.VolunteerID !== id) {
      return Response.json({
        status: 409,
        message: 'Phone number is already in use by another volunteer',
      });
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: {
        VolunteerID: id,
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
      volunteer: updatedVolunteer,
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}