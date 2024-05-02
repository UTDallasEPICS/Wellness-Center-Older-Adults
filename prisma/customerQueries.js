/*
Author: Avishikta Bagchi (3/4/2024)
Updated: 4/18/2024
Checks for a customer using their email, first name, and last name.
Creates a new user if one doesn't exist in the database.
*/
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function customerQuery()
{
const customerEmailVar = 'dummyCustomer@gmail.com'
const customerFNameVar = 'dummyFName'
const customerLNameVar = 'dummyLName'

const customer = await prisma.customer.findMany({
    where: {
      user: {
        customerEmail: customerEmailVar,
        customerFName: customerFNameVar,
        customerLName: customerLNameVar
      }
    },
    // took out include: user because Customer and User tables don't have any relation
  });

if(!customer[0])
{
    await prisma.customer.create({
        data: {
          customerEmail: customerEmailVar,
          customerFname: customerFNameVar,
          customerMname: "dummy middle name",
          customerLname: customerLNameVar,
          customerPhone: "0000000000",
          streetAddress: "dummy street address",
          city: "dummy city",
          state: "dummy state",
          birthdate: "dummy birthdate",
        }
      });
    console.log('This customer did not exist in the database, new customer created.');
}
else
{
    console.log('The customer already exists in the database.');
}
}

module.exports = customerQuery;