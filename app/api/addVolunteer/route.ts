import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VolunteerRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  try {
    const { firstName, lastName, email, phone } = (await req.json()) as VolunteerRequestBody;

    const existingVolunteer = await prisma.volunteer.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (existingVolunteer) {
      // Return a specific error message if the email or phone exists
      if (existingVolunteer.email === email) {
        return Response.json({
          status: 400,
          message: 'Volunteer not added! Email already exists',
        });
      } else if (existingVolunteer.phone === phone) {
        return Response.json({
          status: 400,
          message: 'Volunteer not added! Phone number already exists',
        });
      }
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        rides: {
          create: [],
        },
      },
    });

    return Response.json({
      status: 200,
      message: `${volunteer} created successfully!`,
    });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}
