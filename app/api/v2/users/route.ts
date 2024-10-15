import { PrismaClient } from '@prisma/client';
import { getManagementApiToken } from '../../auth/auth0';
// pages/api/create-user.js

interface UserRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  connection: string;
}

export async function POST(request: Request) {
  //const auth0 = params.auth0;
  const prisma = new PrismaClient();
  const { email, firstName, lastName, password, connection } =
    (await request.json()) as UserRequestBody;

  try {
    await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: '',
      },
    });

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
      body: JSON.stringify(userData), // Data from the client to create the user
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    return Response.json({
      status: 200,
      data: data,
    });
  } catch (error) {
    console.error('Error parsing Request:', error);
    return Response.json({
      error: 'Invalid Request',
      status: 400,
    });
  }
}
