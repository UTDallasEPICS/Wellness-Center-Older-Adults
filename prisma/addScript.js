const prisma = new PrismaClient();

interface VolunteerRequestBody {
  firstName: String;
  lastName: String;
  email: String;
  phone: String;
}




async function addVolunteer(volunteerData) {
  try {
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: volunteerData.firstName,
        lastName: volunteerData.lastName,
        email: volunteerData.email,
        phone: volunteerData.phone,
        rides: {
          create: [], // Empty rides array
        },
      },
    });

    console.log('Volunteer Added: ', volunteer);
  } catch (error) {
    console.error('Error adding volunteer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

  
  