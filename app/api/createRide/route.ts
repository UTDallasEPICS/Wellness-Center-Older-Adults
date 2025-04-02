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
}

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return Response.json({
            status: 405,
            message: 'Method Not Allowed',
        });
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
        } = (await req.json()) as RideRequestBody;

        const time = new Date();
        const [hours, minutes] = pickUpTime.split(':').map(Number);
        time.setHours(hours, minutes, 0, 0);

        const createdRide = await prisma.ride.create({
            data: {
                customerName,
                startTime: time,
                endTime: time,
                volunteerID: 1, // Replace with dynamic value
                customerID: 1, // Replace with dynamic value
                date: new Date(date), // Use date from request
                endLocation: `${destinationStreet}, ${destinationCity}, ${destinationState} ${destinationZip}`, // Construct end location
                startLocation: `${pickupStreet}, ${pickupCity}, ${pickupState} ${pickupZip}`, // Construct start location.
                customerPhone: "555-555-5555", // replace with customer phone
            },
        });

        return Response.json({
            status: 201,
            message: 'Ride created successfully',
            data: createdRide,
        });
    } catch (error) {
        console.error('Error creating ride:', error);
        return Response.json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}