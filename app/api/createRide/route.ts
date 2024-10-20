import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RideRequestBody {
  clientName: String;
  address: String;
  startTime: String;
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  const { clientName, address, startTime } = (await req.json()) as RideRequestBody;

  const time = new Date();

  const [hours, minutes] = startTime.split(':').map(Number);
  time.setHours(hours, minutes, 0, 0); // Set the time on the current date

  await prisma.ride.create({
    data: {
      customerName: clientName.valueOf(),
      time: time,
      startLocation: address.valueOf(),
    },
  });

  return Response.json({
    status: 200,
    message: 'Customer created successfully',
  });
}
