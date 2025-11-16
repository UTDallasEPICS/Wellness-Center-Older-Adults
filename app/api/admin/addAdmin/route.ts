// app/api/admin/addAdmin/route.ts
//import { PrismaClient } from '@prisma/client';
import prisma from "../../../../util/prisma-client";

import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
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

    const existingEmail = await prisma.user.findFirst({ where: { email: rawEmail }, select: { id: true } });
    if (existingEmail) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    if (rawPhone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone: rawPhone }, select: { id: true } });
      if (existingPhone) {
        return NextResponse.json({ message: 'Phone number already in use' }, { status: 409 });
      }
    }

    const user = await prisma.user.create({
      data: {
        email: rawEmail,
        firstName: rawFirst,
        lastName: rawLast,
        phone: rawPhone || null,
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