const { PrismaClient, VolunteerStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const volunteer = await prisma.volunteer.create({
    data: {
      volunteerFName: 'Jane',
      volunteerLName: 'Mary',
      volunteerEmail: 'JaneMary@email.com',
      volunteerPhone: '123-456-7890',
      volunteerStatus: VolunteerStatus.OCCUPIED
    },
  });

  console.log('Volunteer Added: ', volunteer);
}

main()
  .then (async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });