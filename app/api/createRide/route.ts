import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RideRequestBody {
    customerId: number; // Changed to customerId, should be number to match your schema
    pickupStreet: string;
    pickupCity: string;
    pickupState: string;
    pickupZip: string;
    destinationStreet: string;
    destinationCity: string;
    destinationState: string;
    destinationZip: string;
    pickUpTime: string;
    date: string;
    ways: string;
    extraInfo: string;
    // isTwoWayChecked?: boolean; // If you sent it from the front-end
}

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return Response.json({ status: 405, message: 'Method Not Allowed' });
    }

    try {
        const {
            customerId,
            pickupStreet,
            pickupCity,
            pickupState,
            pickupZip,
            destinationStreet,
            destinationCity,
            destinationState,
            destinationZip,
            pickUpTime,
            date,
            ways,
            extraInfo,
            // isTwoWayChecked,
        } = (await req.json()) as RideRequestBody;

        // 1.  Find the Customer ID.
        const customer = await prisma.customer.findUnique({
            where: {
                id: customerId,
            },
        });

        if (!customer) {
            return Response.json({ status: 400, message: 'Customer not found' });
        }

        const pickupDateTime = new Date(date);
        const [hours, minutes] = pickUpTime.split(':').map(Number);
        pickupDateTime.setHours(hours, minutes, 0, 0);

        // Use a transaction to ensure atomicity
        const createdRide = await prisma.$transaction(async (tx) => {
            // 2. Create the Pickup Address
            const startAddress = await tx.address.create({
                data: {
                    street: pickupStreet,
                    city: pickupCity,
                    state: pickupState,
                    postalCode: pickupZip,
                },
            });

            // 3. Create the Destination Address
            const endAddress = await tx.address.create({
                data: {
                    street: destinationStreet,
                    city: destinationCity,
                    state: destinationState,
                    postalCode: destinationZip,
                },
            });

            // 5. Create the Ride record, linking to the created addresses and customer
            const ride = await tx.ride.create({
                data: {
                    customerID: customer.id,
                    date: pickupDateTime,
                    pickupTime: pickupDateTime,
                    startAddressID: startAddress.id,
                    endAddressID: endAddress.id,
                    specialNote: extraInfo,
                    // isTwoWay: isTwoWayChecked,
                    // waitTime: ways ? parseInt(ways) : null,
                    volunteerID: 1, // Replace with your dynamic logic
                },
            });
            return ride;
        })
        .then((ride) => {
            const successResponse = { status: 201, message: 'Ride created successfully', data: ride };
            console.log("API Success Response:", successResponse);
            return Response.json(successResponse);
        })
        .catch((error) => {
            console.error('Error creating ride within transaction:', error);
            return Response.json({
                status: 500,
                message: 'Failed to create ride due to a database error',
                error: error.message, // Include a more specific error message
            });
        });

        return createdRide; // Return the promise from the transaction

    } catch (error: any) {
        console.error('Error during request processing:', error);
        return Response.json({
            status: 500,
            message: 'Internal Server Error during request processing',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
}