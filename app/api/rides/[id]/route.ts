// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const updateData = await request.json();
        console.log("Backend received updateData:", updateData);

        const rideId = parseInt(id, 10);
        if (isNaN(rideId)) {
            return NextResponse.json({ error: 'Invalid ride ID' }, { status: 400 });
        }

        const existingRide = await prisma.ride.findUnique({
            where: { id: rideId },
        });

        if (!existingRide) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        // Prepare the data to update, converting string IDs to integers
        const dataToUpdate: any = {};
        
        // Loop through the incoming data and convert relevant fields to integers
        // This is a more robust way to handle all fields
        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                if (key === 'customerID' || key === 'startAddressID' || key === 'endAddressID' || key === 'volunteerID') {
                    // Check if the value is not null and is a valid number
                    if (updateData[key] !== null && !isNaN(parseInt(updateData[key], 10))) {
                        dataToUpdate[key] = parseInt(updateData[key], 10);
                    } else if (updateData[key] === null) {
                        dataToUpdate[key] = null;
                    }
                } else if (key === 'date' || key === 'pickupTime') {
                    // Handle date and time fields if needed, assuming they are sent as ISO strings
                    dataToUpdate[key] = new Date(updateData[key]);
                } else {
                    dataToUpdate[key] = updateData[key];
                }
            }
        }

        console.log("Data to update:", dataToUpdate);
        let updatedRide;
        if (Object.keys(dataToUpdate).length > 0) {
            // Validate foreign key fields
            const validateForeignKey = async (field: string, value: number | null, model: 'customer' | 'address' | 'volunteer') => {
                if (value === null) {
                    console.log(`${field} is null, skipping validation.`);
                    return;
                }

                let exists;
                if (model === 'customer') {
                    exists = await prisma.customer.findUnique({ where: { id: value } });
                } else if (model === 'address') {
                    exists = await prisma.address.findUnique({ where: { id: value } });
                } else if (model === 'volunteer') {
                    exists = await prisma.volunteer.findUnique({ where: { id: value } });
                }

                if (!exists) {
                    console.warn(`${field} references a non-existent ${model} ID: ${value}. Setting to null.`);
                    dataToUpdate[field] = null; // Fallback: Set invalid foreign key to null
                } else {
                    console.log(`${field} validation passed: ${model} ID ${value} exists.`);
                }
            };

            try {
                console.log('Starting validation for foreign key fields...');
                await validateForeignKey('customerID', dataToUpdate.customerID, 'customer');
                await validateForeignKey('startAddressID', dataToUpdate.startAddressID, 'address');
                await validateForeignKey('endAddressID', dataToUpdate.endAddressID, 'address');
                await validateForeignKey('volunteerID', dataToUpdate.volunteerID, 'volunteer');
                console.log('Validation completed successfully.');
            } catch (validationError: any) {
                console.error('Validation error:', validationError.message);
                return NextResponse.json({ error: validationError.message }, { status: 400 });
            }

            // Transform foreign key fields into nested objects for Prisma
            if ('customerID' in dataToUpdate) {
                dataToUpdate.customer = dataToUpdate.customerID
                    ? { connect: { id: dataToUpdate.customerID } }
                    : { disconnect: true };
                delete dataToUpdate.customerID;
            }

            if ('startAddressID' in dataToUpdate) {
                dataToUpdate.addrStart = dataToUpdate.startAddressID
                    ? { connect: { id: dataToUpdate.startAddressID } }
                    : { disconnect: true };
                delete dataToUpdate.startAddressID;
            }

            if ('endAddressID' in dataToUpdate) {
                dataToUpdate.addrEnd = dataToUpdate.endAddressID
                    ? { connect: { id: dataToUpdate.endAddressID } }
                    : { disconnect: true };
                delete dataToUpdate.endAddressID;
            }

            if ('volunteerID' in dataToUpdate) {
                dataToUpdate.volunteer = dataToUpdate.volunteerID
                    ? { connect: { id: dataToUpdate.volunteerID } }
                    : { disconnect: true };
                delete dataToUpdate.volunteerID;
            }

            // Remove the `id` field from `dataToUpdate` to avoid Prisma validation errors
            delete dataToUpdate.id;

            // Validate the final dataToUpdate object
            console.log('Final data to update:', dataToUpdate);

            try {
                console.log('Attempting to update ride with data:', dataToUpdate);
                updatedRide = await prisma.ride.update({
                    where: { id: rideId },
                    data: dataToUpdate, // Ensure consistent use of dataToUpdate
                });
                console.log('Ride updated successfully:', updatedRide);
                return NextResponse.json({ message: 'Ride updated successfully', updatedRide });
            } catch (dbError: any) {
                console.error('Database update error:', {
                    message: dbError.message,
                    stack: dbError.stack,
                    data: dataToUpdate,
                });
                return NextResponse.json({ error: 'Database update failed', details: dbError.message }, { status: 500 });
            }
        } else {
            console.log("No data to update.");
            return NextResponse.json({ message: 'No data to update' });
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            data: updateData,
        });
        return NextResponse.json({
            error: 'Failed to update ride',
            details: error.message || 'An unknown error occurred',
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}