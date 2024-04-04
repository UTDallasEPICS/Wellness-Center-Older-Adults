/*
Author: Avishikta Bagchi (3/4/2024)
Checks for a customer using their email, first name, and last name.
Creates a new user if one doesn't exist in the database.
*/
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main()
{
    const customerEmail = 'dummyCustomer@gmail.com'
    const customerFirstName = 'dummyFName'
    const customerLastName = 'dummyLName'

    const customer = await prisma.customer.findUnique({
        where: 
        {
            AND: 
            [
                {email: customerEmail},
                {firstName: customerName},
                {lastName: customerLastName}
            ]
        }
    })

    if(customer)
    {
        console.log('The customer already exists in the database.');
    }
    else
    {
        await prisma.customer.create
        ({
            data:
            {
                email: customerEmail,
                firstName: customerFirstName,
                lastName: customerLastName,
                phone: '000000000',
                homeAddress: 'dummy home address'
            }
        })
        console.log('This customer did not exist in the database, new customer created.')
    }
}


