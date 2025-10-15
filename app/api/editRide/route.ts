// app/api/editRide/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to handle the PUT request to edit a ride
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    // You should use the dynamic segment for the ID, not the request body
    // This is a simplified version based on your original request body structure
    // A better approach is to use a route like `api/rides/[id]` and get the ID from params
    
    try {
        const body = await req.json();
        const { id, ...updatedData } = body; // Correctly destructure the ID and the rest of the data

        if (!id) {
            return NextResponse.json({
                status: 400,
                message: 'Ride ID is required.',
            }, { status: 400 });
        }
        
        console.log('Backend received updatedData for editRide:', updatedData);

        // Your frontend sends the date and time fields as ISO strings.
        // Prisma can handle these directly if they are in the correct format.
        // Ensure you are sending the date and pickupTime as a combined ISO string.
        
        // Update the ride in the database using the provided data
        const updatedRide = await prisma.ride.update({
            where: { id: parseInt(id, 10) },
            data: {
                customerID: updatedData.customerID,
                date: updatedData.date,
                startAddressID: updatedData.startAddressID,
                endAddressID: updatedData.endAddressID,
                pickupTime: updatedData.pickupTime,
                volunteerID: updatedData.volunteerID,
                status: updatedData.status,
            },
        });

        // Return a successful response
        return NextResponse.json({
            status: 200,
            message: 'Ride updated successfully',
            ride: updatedRide,
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating ride:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        }, { status: 500 });
    }
}