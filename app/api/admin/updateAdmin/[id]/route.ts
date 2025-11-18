import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid admin ID' }, { status: 400 });
    }

    const body = await req.json();
    const rawEmail = (body?.email ?? '').trim();
    const rawFirst = (body?.firstName ?? '').trim();
    const rawLast = (body?.lastName ?? '').trim();
    const rawPhone = (body?.phone ?? '').trim();
    const phoneDigits = rawPhone.replace(/\D/g, '');

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!rawFirst || !rawLast || !rawEmail) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (!nameRe.test(rawFirst)) {
      return NextResponse.json({ message: 'Invalid first name.' }, { status: 400 });
    }
    if (!nameRe.test(rawLast)) {
      return NextResponse.json({ message: 'Invalid last name.' }, { status: 400 });
    }
    if (!emailRe.test(rawEmail) || rawEmail.length > 254) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }
    if (rawPhone && phoneDigits.length !== 10) {
      return NextResponse.json({ message: 'Invalid phone number. Use exactly 10 digits or leave blank.' }, { status: 400 });
    }

    // Ensure the admin exists
    const existingAdmin = await prisma.user.findUnique({ where: { id }, select: { id: true, isAdmin: true, isArchived: true } });
    if (!existingAdmin || !existingAdmin.isAdmin || existingAdmin.isArchived) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    // Uniqueness checks excluding current user
    const emailConflict = await prisma.user.findFirst({ where: { email: rawEmail, NOT: { id } }, select: { id: true } });
    if (emailConflict) {
      return NextResponse.json({ message: 'Email already in use by another user' }, { status: 409 });
    }
    if (rawPhone) {
      const phoneConflict = await prisma.user.findFirst({ where: { phone: rawPhone, NOT: { id } }, select: { id: true } });
      if (phoneConflict) {
        return NextResponse.json({ message: 'Phone number already in use by another user' }, { status: 409 });
      }
    }

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: {
        email: rawEmail,
        firstName: rawFirst,
        lastName: rawLast,
        phone: rawPhone || null,
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