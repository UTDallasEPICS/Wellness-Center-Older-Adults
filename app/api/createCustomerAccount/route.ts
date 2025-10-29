import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserRequestBody {
  firstName: string;
  lastName: string;
  middleName?: string;
  customerPhone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  customerZipCode?: string;
}

export async function POST(req: Request) {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          status: 405,
          message: 'Method Not Allowed',
        }),
        { status: 405 }
      );
    }

    const body = (await req.json()) as UserRequestBody;
    console.log('Received request body:', body);

    // Normalize/trim
    const first = (body.firstName || '').trim();
    const middle = (body.middleName || '').trim();
    const last = (body.lastName || '').trim();
    const street = (body.streetAddress || '').trim();
    const city = (body.city || '').trim();
    const state = (body.state || '').trim();
    const zip = (body.customerZipCode || '').toString().trim();
    const phoneRaw = (body.customerPhone || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');

    // Validation rules (aligned with volunteer validation style)
    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars
    const zipRe = /^\d{5}$/;
    const US_STATES = [
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
      'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
      'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
    ];

    // Required checks
    if (!first || !last || !street || !city || !state || !zip) {
      return new Response(
        JSON.stringify({ status: 400, message: 'All required fields must be provided.' }),
        { status: 400 }
      );
    }
    if (!nameRe.test(first)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid first name.' }),
        { status: 400 }
      );
    }
    if (!nameRe.test(last)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid last name.' }),
        { status: 400 }
      );
    }
    if (middle && !nameRe.test(middle)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid middle name.' }),
        { status: 400 }
      );
    }
    if (!US_STATES.includes(state)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid state.' }),
        { status: 400 }
      );
    }
    if (!zipRe.test(zip)) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid ZIP code.' }),
        { status: 400 }
      );
    }
    if (phoneRaw && phoneDigits.length !== 10) {
      return new Response(
        JSON.stringify({ status: 400, message: 'Invalid phone number. Use exactly 10 digits or leave blank.' }),
        { status: 400 }
      );
    }

    // 1. Create the new Address record
    const newAddress = await prisma.address.create({
      data: {
        street: street,
        city: city,
        state: state,
        postalCode: zip, // Ensure it's a string
      },
    });

    // 2. Create the new Customer record and link it to the new Address
    const customerData: any = {
      firstName: first,
      lastName: last,
      addressID: newAddress.id,
    };
    if (middle) customerData.middleName = middle;
    if (phoneRaw) customerData.customerPhone = phoneRaw;

    const newCustomer = await prisma.customer.create({
      data: customerData,
    });

    return new Response(
      JSON.stringify({
        status: 201,
        message: 'Customer created successfully',
        data: { ...newCustomer, address: newAddress }, // Include the created address in the response
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}