import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try{
    const availableRides = await prisma.ride.findMany({
      where: {
        status: 'AVAILABLE',
      },
      select:{
        time: true,
        startLocation: true,
        customerName: true,
        customerPhone: true,
      },
    });


    if(!availableRides || availableRides.length === 0) {
      return NextResponse.json({error: 'No Rides Available Currently'}, {status:404 }); 
    }

    return NextResponse.json(availableRides);

  } catch (error){
    console.error('Error fetching available rides: ', error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }

}