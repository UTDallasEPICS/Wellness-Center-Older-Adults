// Creates a superuser if one does not exist.
// This acount will be the admin account used to issue new accounts
// Written by: Arif Nizami
//switch out info to my account
//run npx prisma db seed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'anishkothuri@gmail.com';

  // Checks if the superuser exists when called
  const adminUser = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  // Here, the call is made to check if the superuser exists.
  // If it does not exist, it creates an account with dummy credentials
  if (!adminUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: "Anish",
        lastName: "Kothuri",
        phone: "1435534489",
      },
    });
    console.log("An admin account was not found, so one was created for you.");
  } else {
    console.log("An admin account already exists! Exiting...");
  }
}

// Runs the program
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
