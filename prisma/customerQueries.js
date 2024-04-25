/*
Author: Avishikta Bagchi (3/4/2024)
Updated: 4/18/2024
Checks for a customer using their email, first name, and last name.
Creates a new user if one doesn't exist in the database.
*/
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function customerQueries()
{
const customerEmail = 'dummyCustomer@gmail.com'
const customerFName = 'dummyFName'
const customerLName = 'dummyLName'

const customer = await prisma.customer.findMany({
    where: {
      user: {
        email: customerEmail,
        firstName: customerFName,
        lastName: customerLName
      }
    },
    include: {
      user: true // Optionally include the User data in the result
    }
  });

if(!customer[0])
{
    await prisma.customer.create({
        data: {
          homeAddress: 'dummy home address',
          user: {
            create: {
              email: customerEmail,
              firstName: customerFName,
              lastName: customerLName,
              phone: "000000000",
            }
          }
        }
      });
    console.log('This customer did not exist in the database, new customer created.');
}
else
{
    console.log('The customer already exists in the database.');
}
}


