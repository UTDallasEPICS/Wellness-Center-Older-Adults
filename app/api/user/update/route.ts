import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getTokenFromRequest(request: any) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookie = request.headers.get('cookie');
  if (cookie) {
    const match = cookie.match(/cvtoken=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export async function PUT(request: any) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      console.error('PUT /api/user/update: Unauthorized - No token provided');
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.decode(token);
    } catch (err) {
      console.error('PUT /api/user/update: Unauthorized - Invalid token format');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const email = decoded?.email;
    if (!email) {
      console.error('PUT /api/user/update: Unauthorized - Email missing in token');
      return NextResponse.json({ error: 'Unauthorized: Email missing in token' }, { status: 401 });
    }
    console.log(`PUT /api/user/update: Attempting to update user: ${email}`);


    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      volunteerStatus,
      notificationSettings
    } = body;

    console.log('PUT /api/user/update: Received notificationSettings:', JSON.stringify(notificationSettings).substring(0, 100) + '...');

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;

    if (notificationSettings !== undefined) {
      if (!Array.isArray(notificationSettings)) {
        console.error('PUT /api/user/update: Validation Error - notificationSettings is not an array.');
        return NextResponse.json({ error: 'Invalid format for notification settings. Expected array.' }, { status: 400 });
      }
      updateData.notificationSettings = notificationSettings;
    }


    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { email },
        data: updateData,
        select: { id: true, volunteer: true }
      });
      console.log(`PUT /api/user/update: User profile updated successfully for ID: ${updatedUser.id}`);

    } catch (e: any) {
      if (e.code === 'P2025') {
        console.error(`PUT /api/user/update: Prisma Error (P2025) - User not found with email: ${email}`);
        return NextResponse.json({ error: 'User not found or database record missing' }, { status: 404 });
      }
      console.error('PUT /api/user/update: Fatal Prisma Error during user update:', e);
      return NextResponse.json({ error: 'Database update failed due to unexpected error' }, { status: 500 });
    }

    if (volunteerStatus !== undefined && updatedUser) {
      if (updatedUser.volunteer) {
        await prisma.volunteerInfo.update({
          where: { userID: updatedUser.id },
          data: { status: volunteerStatus },
        });
        console.log(`PUT /api/user/update: Volunteer status updated for ID: ${updatedUser.id}`);
      } else {
        await prisma.volunteerInfo.create({
          data: { userID: updatedUser.id, status: volunteerStatus }
        });
        console.log(`PUT /api/user/update: VolunteerInfo created for ID: ${updatedUser.id}`);
      }
    }

    return NextResponse.json({ message: 'Profile updated successfully' });

  } catch (error: any) {
    console.error('API Error during profile update (Non-Prisma/Auth related):', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}