// app/api/vs/user/route.ts

import prisma from '../../../util/prisma-client';
import { NextResponse } from 'next/server';
import { getManagementApiToken } from '@/app/api/auth/auth0'; // Adjust path as needed

interface UserRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  connection: string;
}

 

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, password, connection } =
      (await request.json()) as UserRequestBody;

    // Save user to your local database
    await prisma.admin.create({
      data: {
        email,
        firstName,
        lastName,
        phone: '',
      },
    });

    // Call Auth0 API to create user
    const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
    const token = await getManagementApiToken();

    const userData = {
      email,
      password,
      connection,
    };

    const response = await fetch(`${ISSUER_BASEURL}api/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create Auth0 user');
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: data,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      message: 'Error creating user',
      error: (error as Error).message,
    }, { status: 400 });
  }
}
