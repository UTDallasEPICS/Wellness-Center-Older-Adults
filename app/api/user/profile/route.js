import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma-client';
import jwt from 'jsonwebtoken';

 

// Helper to extract JWT from Authorization header or cookie
function getTokenFromRequest(request) {
  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Try cookie (cvtoken)
  const cookie = request.headers.get('cookie');
  if (cookie) {
    const match = cookie.match(/cvtoken=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

// This API route fetches a user's profile and volunteer status (if applicable).
export async function GET(request) {
  try {
    // 1. Extract and verify Auth0 JWT
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    let decoded;
    try {
      // Use your Auth0 domain as the issuer
      decoded = jwt.decode(token);
      // Optionally, verify signature with Auth0 public key (for production)
      // For now, just decode and trust (not secure for production)
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const email = decoded?.email;
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized: Email missing in token' }, { status: 401 });
    }

    // 2. Find the base User record by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Find the VolunteerInfo (Optional)
    const volunteerInfo = await prisma.volunteerInfo.findUnique({
      where: { userID: user.id },
      include: {
        rides: {
          where: { isArchived: false },
          include: { addrStart: true, addrEnd: true },
        },
      },
    });

    // 4. Construct the user data payload
    const isVolunteer = !!volunteerInfo;
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone || '',
      birthdate: user.birthdate || '',
      profilePicUrl: user.profilePicUrl || null, 
      isVolunteer: isVolunteer,
      volunteerStatus: isVolunteer ? volunteerInfo.status : '',
      assignedRides: isVolunteer ? volunteerInfo.rides : [],
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('API Error during profile fetch:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
