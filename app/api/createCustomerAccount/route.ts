import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserRequestBody {
  customerEmail: string;
  firstName: string;
  lastName: string;
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  const { customerEmail, firstName, lastName } = (await req.json()) as UserRequestBody;

  const existingCustomer = await prisma.customer.findFirst({
    where: {
      customerEmail,
      firstName,
      lastName,
    },
  });

  if (existingCustomer) {
    return Response.json({
      status: 409,
      message: 'Customer already exists',
    });
  }

  await prisma.customer.create({
    data: {
      customerEmail: customerEmail, // Ensure `customerEmail` is a string
      firstName: firstName, // Ensure `firstName` is a string
      middleName: 'dummy middle name', // Optional, but included here
      lastName: lastName, // Ensure `lastName` is a string
      customerPhone: '0000000000', // Ensure it's a string
      streetAddress: 'dummy street address', // Ensure it's a string
      city: 'dummy city', // Ensure it's a string
      state: 'dummy state', // Optional, included here
      zipcode: '75024', 
      birthdate: new Date('2022-09-27T18:00:00.000Z').toISOString(), // Optional, included here
    },
  });

  return Response.json({
    status: 200,
    message: 'Customer created successfully',
  });
}
