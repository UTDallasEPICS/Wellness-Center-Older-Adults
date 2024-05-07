/*
** Route to handle customer creation request
*/
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function createCustomer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customerEmail, customerFname, customerLname } = req.body;

  // searches for the customer with email, first name, and last name
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        customerEmail,
        customerFname,
        customerLname
      }
    });

    if (existingCustomer) { // if the customer already exists
      return res.status(409).json({ message: 'Customer already exists' });
    }

    //otherwise, a new customer is created
    await prisma.customer.create({
      data: {
        customerEmail,
        customerFname,
        customerMname: "dummy middle name",
        customerLname,
        customerPhone: "0000000000",
        streetAddress: "dummy street address",
        city: "dummy city",
        state: "dummy state",
        birthdate: "dummy birthdate",
      }
    });

    return res.status(201).json({ message: 'Customer created successfully' });// upon customer creation
 
}
