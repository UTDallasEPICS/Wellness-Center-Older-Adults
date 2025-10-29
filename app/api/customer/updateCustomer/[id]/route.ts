import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { email, firstName, middleName, lastName, customerPhone, addressID } = body;

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        customerPhone: customerPhone || null,
        addressID
      },
    });

    return NextResponse.json({ message: 'Customer updated successfully', user: updatedCustomer }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ message: 'Error updating customer', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}