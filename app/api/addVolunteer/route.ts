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

    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    const mail = (email || '').trim();
    const phoneRaw = (phone || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!first || !last || !mail || !phoneRaw) {
      return new Response(
        JSON.stringify({ status: 400, message: 'All fields are required.' }),
        { status: 400 }
      );
    }
    if (!nameRe.test(first)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid first name.' }),
        { status: 400 }
      );
    }
    if (!nameRe.test(last)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid last name.' }),
        { status: 400 }
      );
    }
    if (!emailRe.test(mail) || mail.length > 254) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid email address.' }),
        { status: 400 }
      );
    }
    if (phoneDigits.length !== 10) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid phone number. Use exactly 10 digits.' }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: mail,
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
        phone: phoneRaw,
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
        firstName: first,
        lastName: last,
        email: mail,
        phone: phoneRaw,
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
