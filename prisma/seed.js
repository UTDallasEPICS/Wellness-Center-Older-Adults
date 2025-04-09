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
    data: {
      email: "volunteer@volunteer.org",
      firstName: "Volly",
      lastName: "Ball",
      phone: "2345678901",
      role: "VOLUNTEER",
    },
    data:{
   startaddress: {
      street: "8209 Cottage Dr.",
      city: "Mckinney",
      state: "TX",
      zip: "75070",
    },
    endaddress: {
      street: "8921 Mount Ranier Dr.",
      city: "Plano",
      state: "TX",
      zip: "75025",
    },
    pickUpTime: new Date("2023-10-01T10:00:00Z"),
    date: new Date("2023-10-01"),
    ways: 2,
    extraInfo: "Help with groceries",
    status: "Added",
    volunteerName: "Volly Ball",
    hours: 2,
    time: new Date("2023-10-01T12:00:00Z"),
    customerName: "Deethya Janjanam",
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
