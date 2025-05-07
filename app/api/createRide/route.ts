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
            customerId, // Changed to customerId
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
            // isTwoWayChecked, // If you sent it from the front-end
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
                    // isTwoWay: isTwoWayChecked, // If you added these fields to your Ride schema:
                    // waitTime: ways ? parseInt(ways) : null,
                    volunteerID: 1, // Replace with your dynamic logic
                },
            });
            return ride;
        });

        const successResponse = { status: 201, message: 'Ride created successfully', data: createdRide };
        console.log("API Success Response:", successResponse);
        return Response.json(successResponse);

    } catch (error: any) {
        console.error('Error creating ride:', error);
        return Response.json({
            status: 500,
            message: 'Internal Server Error',
            error: error, // Include the error object for more details
        });
    } finally {
        await prisma.$disconnect();
    }
}