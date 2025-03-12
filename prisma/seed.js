const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "User",
      phone: "1234567890",
      role: "ADMIN",
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
