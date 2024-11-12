/*
 ** Route to handle customer creation request
 */
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

  // searches for the customer with email, first name, and last name
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      customerEmail,
      firstName,
      lastName,
    },
  });

  if (existingCustomer) {
    // if the customer already exists
    return Response.json({
      status: 409,
      message: 'Customer already exists',
    });
  }

  //otherwise, a new customer is created
  await prisma.customer.create({
    data: {
      customerEmail,
      firstName,
      middleName: 'dummy middle name',
      lastName,
      customerPhone: '0000000000',
      streetAddress: 'dummy street address',
      city: 'dummy city',
      state: 'dummy state',
      birthdate: new Date('2022-09-27T18:00:00.000Z').toISOString(),
    },
  });

  return Response.json({
    status: 200,
    message: 'Customer created successfully',
  });
}
