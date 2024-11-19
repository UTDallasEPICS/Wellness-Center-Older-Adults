import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

interface DeleteVolunteerParams {
  id: number;
}

export async function DELETE(req: Request) {
  if (req.method !== 'DELETE') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  try{
    const { id } = (await req.json()) as DeleteVolunteerParams;

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: {
        VolunteerID: id,
      },

    });

    if(!existingVolunteer) {
      return Response.json({
        status: 404,
        message: 'Volunteer not found',
      });
    }

    await prisma.volunteer.delete({
      where: {
        VolunteerID: id,
      },
    })

    return Response.json({
      status: 200,
      message: 'Volunteer deleted successfully',
    });



  }catch(error){
    console.error('Error deleting volunteer:', error);
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}