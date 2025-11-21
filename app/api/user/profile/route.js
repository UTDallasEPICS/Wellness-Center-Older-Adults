import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getTokenFromRequest(request) {
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

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const email = decoded?.email;
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized: Email missing in token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const volunteerInfo = await prisma.volunteerInfo.findUnique({
      where: { userID: user.id },
      include: {
        rides: {
          where: { isArchived: false },
          include: { addrStart: true, addrEnd: true },
        },
      },
    });

    const isVolunteer = !!volunteerInfo;
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone || '',
      birthdate: user.birthdate || '',
      profilePicUrl: user.profilePicUrl || null,
      notificationSettings: user.notificationSettings || [],
      isVolunteer: isVolunteer,
      volunteerStatus: isVolunteer ? volunteerInfo?.status : '',
      assignedRides: isVolunteer ? volunteerInfo?.rides : [],
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('API Error during profile fetch:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}