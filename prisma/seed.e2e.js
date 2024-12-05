const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.create({
    data: {
        email: "e2ewcoatestuser@utdallas.edu",
        firstName: "E2E",
        lastName: "TEST",
        phone: "0000000000",
    },
  });

  // Other Seed Data goes here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
