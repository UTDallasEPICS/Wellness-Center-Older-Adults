//import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from "../../../../../util/prisma-client";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ status: 400, message: 'Invalid customer ID' }, { status: 400 });
    }

    const body = await req.json();
    const {
      firstName,
      middleName,
      lastName,
      customerPhone,
      streetAddress,
      city,
      state,
      customerZipCode,
    } = body as {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      customerPhone?: string;
      streetAddress?: string;
      city?: string;
      state?: string;
      customerZipCode?: string | number;
    };

    // Normalize
    const first = (firstName || '').trim();
    const middle = (middleName || '').trim();
    const last = (lastName || '').trim();
    const street = (streetAddress || '').trim();
    const cityNorm = (city || '').trim();
    const stateNorm = (state || '').trim();
    const zip = (customerZipCode || '').toString().trim();
    const phoneRaw = (customerPhone || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');

    // Validate similar to create route
    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/;
    const zipRe = /^\d{5}$/;
    const US_STATES = [
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
      'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
      'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
    ];

    if (!first || !last || !street || !cityNorm || !stateNorm || !zip) {
      return NextResponse.json({ status: 400, message: 'All required fields must be provided.' }, { status: 400 });
    }
    if (!nameRe.test(first)) {
      return NextResponse.json({ status: 400, message: 'Invalid first name.' }, { status: 400 });
    }
    if (!nameRe.test(last)) {
      return NextResponse.json({ status: 400, message: 'Invalid last name.' }, { status: 400 });
    }
    if (middle && !nameRe.test(middle)) {
      return NextResponse.json({ status: 400, message: 'Invalid middle name.' }, { status: 400 });
    }
    if (!US_STATES.includes(stateNorm)) {
      return NextResponse.json({ status: 400, message: 'Invalid state.' }, { status: 400 });
    }
    if (!zipRe.test(zip)) {
      return NextResponse.json({ status: 400, message: 'Invalid ZIP code.' }, { status: 400 });
    }
    if (phoneRaw && phoneDigits.length !== 10) {
      return NextResponse.json({ status: 400, message: 'Invalid phone number. Use exactly 10 digits or leave blank.' }, { status: 400 });
    }

    // Ensure the customer exists and get current addressID
    const existing = await prisma.customer.findUnique({ where: { id }, select: { addressID: true } });
    if (!existing) {
      return NextResponse.json({ status: 404, message: 'Customer not found' }, { status: 404 });
    }

    // Update address
    if (existing.addressID) {
      await prisma.address.update({
        where: { id: existing.addressID },
        data: { street, city: cityNorm, state: stateNorm, postalCode: zip },
      });
    }

    // Update customer (omit optional fields when empty)
    const updateData: any = {
      firstName: first,
      lastName: last,
    };
    if (middle) updateData.middleName = middle;
    if (phoneRaw) updateData.customerPhone = phoneRaw;

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: { address: true },
    });

    return NextResponse.json({ status: 200, message: 'Customer updated successfully', user: updatedCustomer }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ message: 'Error updating customer', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}