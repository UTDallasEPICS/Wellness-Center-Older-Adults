import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth0.ts";

// You will need to import your database client here
// For example:
// import prisma from '@/path/to/your/db'; 

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, username } = body; 

    // Find the user's record using the session email to ensure it's the correct user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user's record with the new data
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, 
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        username: username,
      },
    });

    console.log("Updated user:", updatedUser);

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Failed to update account' }, { status: 500 });
  }
}