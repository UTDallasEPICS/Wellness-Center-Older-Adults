import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RideRequestBody {
  clientName: String;
  phoneNumber: String;
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

  const { clientName, phoneNumber, address, startTime } = (await req.json()) as RideRequestBody;

  const time = new Date();

  const [hours, minutes] = startTime.split(':').map(Number);
  time.setHours(hours, minutes, 0, 0); // Set the time on the current date

  await prisma.ride.create({
    data: {
        "customerName": "Alice Wonderland",
        "customerPhone": "555-7890",
        "driverID": 1,
        "volunteerID": 1,
        "customerID": 1,
        "date": "2024-01-15T00:00:00Z",
        "time": "08:30:00Z",
        "startLocation": "123 Fantasy Rd",
        "endLocation": "456 Wonderland Plaza",
        "status": "COMPLETED"
      
    },
  });

  return Response.json({
    status: 200,
    message: 'Customer created successfully',
  });
}
