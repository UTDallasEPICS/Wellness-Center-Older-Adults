const { PrismaClient } = require("@prisma/client");
 

async function main() {
  // Clear existing data to prevent conflicts on re-seeding
  await prisma.ride.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.volunteerInfo.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.address.deleteMany({});

  // Seed Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "User",
      phone: "012346789",
      role: "ADMIN",
      isAdmin: true,
    },
  });

  const volunteerUser = await prisma.user.create({
    data: {
      email: "volunteer@volunteer.org",
      firstName: "Volly",
      lastName: "Ball",
      phone: "2345678901",
      role: "VOLUNTEER",
    },
  });

  // Seed VolunteerInfo for volunteer user
  const volunteerInfo = await prisma.volunteerInfo.create({
    data: {
      userID: volunteerUser.id,
      status: "AVAILABLE",
    },
  });

  // Seed Addresses with real locations in Plano, TX
  const address1 = await prisma.address.create({
    data: {
      street: "401 W 16th St",
      city: "Plano",
      state: "TX",
      postalCode: "75075", // Sam Johnson Recreation Center for Older Adults
    },
  });

  const address2 = await prisma.address.create({
    data: {
      street: "4700 Alliance Blvd",
      city: "Plano",
      state: "TX",
      postalCode: "75093", // Texas Health Presbyterian Hospital Plano
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
      specialNote: "Customer needs assistance getting into the vehicle.",
      status: "AVAILABLE",
      volunteerID: volunteerInfo.id,
    },
  });
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
