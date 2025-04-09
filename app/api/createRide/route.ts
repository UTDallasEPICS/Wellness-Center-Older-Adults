import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RideRequestBody {
    customerName: string;
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
    // You might expect isTwoWayChecked here if needed
}

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return Response.json({ status: 405, message: 'Method Not Allowed' });
    }

    try {
        const {
            customerName,
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

        // 1. Find the Customer ID based on the customerName
        const customer = await prisma.customer.findFirst({
            where: {
                firstName: customerName,
            },
        });

        if (!customer) {
            return Response.json({ status: 400, message: 'Customer not found' });
        }

        // 2. Create the Pickup Address
        const startAddress = await prisma.address.create({
            data: {
                street: pickupStreet,
                city: pickupCity,
                state: pickupState,
                postalCode: pickupZip,
            },
        });

        // 3. Create the Destination Address
        const endAddress = await prisma.address.create({
            data: {
                street: destinationStreet,
                city: destinationCity,
                state: destinationState,
                postalCode: destinationZip,
            },
        });

        // 4. Parse the Pick-Up Time
        const [hours, minutes] = pickUpTime.split(':').map(Number);
        const pickupDateTime = new Date(date);
        pickupDateTime.setHours(hours, minutes, 0, 0);

        // 5. Create the Ride record, linking to the created addresses and customer
        const createdRide = await prisma.ride.create({
            data: {
                customerID: customer.id,
                date: new Date(date),
                pickupTime: pickupDateTime,
                startAddressID: startAddress.id,
                endAddressID: endAddress.id,
                specialNote: extraInfo,
                // If you added these fields to your Ride schema:
                // isTwoWay: isTwoWayChecked,
                // waitTime: ways ? parseInt(ways) : null,
                volunteerID: 1, // Replace with your dynamic logic
            },
        });

        const successResponse = { status: 201, message: 'Ride created successfully', data: createdRide };
        console.log("API Success Response:", successResponse);
        return Response.json(successResponse);

    } catch (error) {
        console.error('Error creating ride:', error);
        return Response.json({ status: 500, message: 'Internal Server Error', error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}