// C:\Users\Deethya Janjanam\temp\Wellness-Center-Older-Adults\app\api\editVolunteer\route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EditVolunteerParams {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    console.error('Failed to parse request body as JSON:', error);
    return Response.json({
      status: 400,
      message: 'Invalid JSON body in request',
    });
  }
try {
    const { id, firstName, lastName, email, phone } = requestBody as EditVolunteerParams;

    // Convert the ID to a number
    const volunteerId = Number(id);

    if (isNaN(volunteerId) || !firstName || !lastName || !email || !phone) {
        return Response.json({
            status: 400,
            message: 'Missing or invalid required fields',
        });
    }

    const existingVolunteer = await prisma.volunteerInfo.findUnique({
        where: {
            id: volunteerId, // Use the converted number here
        },
    });

    if (!existingVolunteer) {
        return Response.json({
            status: 404,
            message: 'Volunteer not found',
        });
    }

    // ... (rest of the code for updating the user)

} catch (error) {
    console.error('Error updating volunteer:', error);
    return Response.json({
        status: 500,
        message: 'Internal Server Error',
    });
}
}