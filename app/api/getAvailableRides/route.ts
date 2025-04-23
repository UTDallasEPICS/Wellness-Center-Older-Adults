import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { middleware } from '@/middleware';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  try {
    const rides = await prisma.ride.findMany({
      where: {
        // status: 'AVAILABLE',
        //NOTE: EVENTUALLY YOU SHOULD ALSO LOOK FOR RIDES THAT ARE CONNECTED TO THE ID OF
        //THE VOLUNTEER SHOULD ALSO BE ABLE TO  SEE WHAT RIDES THEY HAVE RESERVED
      },

      select: {
        customer: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            customerPhone: true,
          }
        },
        addrStart: true,
        addrEnd: true,
        date: true,
        pickupTime: true,
      },
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}