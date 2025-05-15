// app/api/admin/addAdmin/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, phone } = await req.json();

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        role: 'ADMIN',
        isAdmin: true,
      },
    });

    return NextResponse.json({ message: 'Admin created successfully', user }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ message: 'Error creating admin', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}