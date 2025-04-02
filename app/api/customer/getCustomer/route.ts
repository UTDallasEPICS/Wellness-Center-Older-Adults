// app/api/customer/getCustomer/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        firstName: true,
      },
    });
    const names = customers.map((customer) => customer.firstName);
    return NextResponse.json(names);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}