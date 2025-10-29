import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserRequestBody {
  firstName: string;
  lastName: string;
  middleName?: string;
  customerPhone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  customerZipCode?: string;
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
    console.log('Received request body:', body);

    // Validation: Ensure required fields are provided for both Customer and Address
    const { firstName, lastName, streetAddress, city, state, customerZipCode } = body;
    if (!firstName || !lastName || !streetAddress || !city || !state || !customerZipCode) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: 'Missing required fields for customer or address',
        }),
        { status: 400 }
      );
    }

    // 1. Create the new Address record
    const newAddress = await prisma.address.create({
      data: {
        street: streetAddress,
        city: city,
        state: state,
        postalCode: customerZipCode.toString(), // Ensure it's a string
      },
    });

    // 2. Create the new Customer record and link it to the new Address
    const newCustomer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        middleName: body.middleName || null,
        customerPhone: body.customerPhone || null, // Allow null if phone isn't always required
        addressID: newAddress.id, // Link to the newly created Address
      },
    });

    return new Response(
      JSON.stringify({
        status: 201,
        message: 'Customer created successfully',
        data: { ...newCustomer, address: newAddress }, // Include the created address in the response
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
  } finally {
    await prisma.$disconnect();
  }
}