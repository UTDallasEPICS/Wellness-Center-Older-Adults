const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const volunteer = await prisma.volunteer.create({
    data: {
      volunteerFname: 'John',
      volunteerLname: 'Doe',
      volunteerEmail: 'JohnDoe@email.com',
      volunteerPhone: '123-456-7890',
      rideStatus: 'available',
    },
  });


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