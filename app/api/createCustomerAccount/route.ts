import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserRequestBody {
  customerEmail: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  customerPhone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  customerZipCode?: number;
  birthdate?: string;
}

export async function POST(req: Request) {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          status: 405,
          message: 'Method Not Allowed',
        }),
        { status: 405 }
      );
    }

    const body = (await req.json()) as UserRequestBody;

    // Validation: Ensure required fields are provided
    const { customerEmail, firstName, lastName } = body;
    if (!customerEmail || !firstName || !lastName) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: 'Missing required fields: customerEmail, firstName, or lastName',
        }),
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        customerEmail,
      },
    });

    if (existingCustomer) {
      return new Response(
        JSON.stringify({
          status: 409,
          message: 'Customer already exists',
        }),
        { status: 409 }
      );
    }

    const newCustomer = await prisma.customer.create({
      data: {
        customerEmail,
        firstName,
        lastName,
        middleName: body.middleName || null,
        customerPhone: body.customerPhone || '0000000000',
        streetAddress: body.streetAddress || 'N/A',
        city: body.city || 'N/A',
        state: body.state || 'N/A',
        customerZipCode: body.customerZipCode || 0,
        birthdate: body.birthdate ? new Date(body.birthdate).toISOString() : null,
      },
    });

    return new Response(
      JSON.stringify({
        status: 201,
        message: 'Customer created successfully',
        data: newCustomer,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
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
