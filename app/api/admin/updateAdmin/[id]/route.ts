import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { email, firstName, lastName, phone } = body;

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: {
        email,
        firstName,
        lastName,
        phone: phone || null,
      },
    });

    return NextResponse.json({ message: 'Admin updated successfully', user: updatedAdmin }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ message: 'Error updating admin', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}