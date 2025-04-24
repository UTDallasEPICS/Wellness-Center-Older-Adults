import prisma from '../../../util/prisma-client';

interface VolunteerRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        status: 405,
        message: 'Method Not Allowed',
      }),
      { status: 405 }
    );
  }

  try {
    const { firstName, lastName, email, phone } = (await req.json()) as VolunteerRequestBody;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: 'Volunteer not added! Email already exists',
        }),
        { status: 400 }
      );
    }

    // Check if the phone number already exists
    const existingPhone = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: 'Volunteer not added! Phone number already exists',
        }),
        { status: 400 }
      );
    }

    // Create the user and link it to the volunteer
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        role: 'VOLUNTEER',
        volunteer: {
          create: {
            status: 'AVAILABLE',
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        status: 201,
        message: 'Volunteer created successfully',
        data: newUser,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}
