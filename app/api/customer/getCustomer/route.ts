// app/api/customer/getCustomer/route.ts
import { NextResponse } from 'next/server';
//import { PrismaClient } from '@prisma/client';
import prisma from "../../../../util/prisma-client";


export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        address: true, // Include the address relationship
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching Clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Clients' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}