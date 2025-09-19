// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "User",
      phone: "012346789",
      role: "ADMIN",
    },
  });

  //const volunteerUser = await prisma.user.create({
  //  data: {
  //    email: "volunteer@volunteer.org",
  //    firstName: "Volly",
  //    lastName: "Ball",
  //    phone: "2345678901",
  //    role: "VOLUNTEER",
  //  },
  //});

  // Seed VolunteerInfo for volunteer user
  const volunteerInfo = await prisma.volunteerInfo.create({
    data: {
      userID: volunteerUser.id,
      status: "AVAILABLE",
    },
  });

  // Seed Addresses
  const address1 = await prisma.address.create({
    data: {
      street: "123 Main St",
      city: "Townsville",
      state: "TS",
      postalCode: "12345",
    },
  });

  const address2 = await prisma.address.create({
    data: {
      street: "456 Elm St",
      city: "Villagetown",
      state: "VT",
      postalCode: "67890",
    },
  });

  // Seed Customer
  const customer = await prisma.customer.create({
    data: {
      firstName: "John",
      middleName: "Q",
      lastName: "Public",
      customerPhone: "3456789012",
      addressID: address1.id,
    },
  });

  // Seed Ride
  await prisma.ride.create({
    data: {
      customerID: customer.id,
      date: new Date(),
      pickupTime: new Date(new Date().getTime() + 15 * 60000), // 15 mins from now
      startAddressID: address1.id,
      endAddressID: address2.id,
      specialNote: "Customer needs assistance",
      status: "AVAILABLE",
      volunteerID: volunteerInfo.id,
    },
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });