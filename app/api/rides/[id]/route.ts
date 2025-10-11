import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to parse address string (kept for completeness, though not relevant to the panic)
function parseAddressString(addressString: string) {
    const parts = addressString.split(', ');
    if (parts.length >= 3) {
        const street = parts[0];
        const city = parts[1];
        const stateZip = parts[2].split(' ');
        const state = stateZip[0];
        const postalCode = stateZip.slice(1).join(' ');
        
        return { street, city, state, postalCode };
    }
    return null;
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    let updateData: any = {}; // Define outside try to ensure scope for final error logging

    try {
        updateData = await request.json();
        console.log("Backend received updateData:", updateData);
        // Payload received from the 'reserve' button is likely just: { status: 'Reserved' }

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

        // Prepare the data to update
        const dataToUpdate: Record<string, any> = {};
        
        // Loop through the incoming data and convert relevant fields to integers
        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                if (key === 'customerID' || key === 'startAddressID' || key === 'endAddressID' || key === 'volunteerID') {
                    const value = updateData[key];
                    // Check if the value is not null and is a valid number string
                    if (value !== null && value !== undefined && !isNaN(parseInt(value, 10))) {
                        dataToUpdate[key] = parseInt(value, 10);
                    } else if (value === null || value === undefined) {
                        // If the incoming ID is null or undefined, set it to null in dataToUpdate
                        dataToUpdate[key] = null;
                    }
                    // Skip if it's not null/undefined but also not a valid number (e.g., empty string)
                } else if (key === 'date' || key === 'pickupTime') {
                    // Handle date and time fields if needed, assuming they are sent as ISO strings
                    dataToUpdate[key] = new Date(updateData[key]);
                } else {
                    dataToUpdate[key] = updateData[key];
                }
            }
        }

        console.log("Data to update after integer conversion:", dataToUpdate);

        let updatedRide;
        if (Object.keys(dataToUpdate).length > 0) {
            
            // Validate foreign key fields
            // *** THIS IS WHERE THE FIX IS APPLIED ***
            const validateForeignKey = async (
                field: string, 
                value: number | null | undefined, 
                model: 'customer' | 'address' | 'volunteer'
            ) => {
                // FIX: Explicitly check for both null and undefined before using the value in a query.
                // The original code failed because `undefined !== null` in JS, causing Prisma to panic 
                // when it received `undefined` for the ID field.
                if (value === null || value === undefined) {
                    console.log(`${field} is null/undefined, skipping validation.`);
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
                // Pass undefined if the field isn't in dataToUpdate
                await validateForeignKey('customerID', dataToUpdate.customerID, 'customer');
                await validateForeignKey('startAddressID', dataToUpdate.startAddressID, 'address');
                await validateForeignKey('endAddressID', dataToUpdate.endAddressID, 'address');
                await validateForeignKey('volunteerID', dataToUpdate.volunteerID, 'volunteer');
                console.log('Validation completed successfully.');
            } catch (validationError: any) {
                // This catch handles errors during the validation queries themselves (not the panic)
                console.error('Validation error caught:', validationError.message);
                return NextResponse.json({ error: validationError.message }, { status: 400 });
            }

            // Transform foreign key fields into nested objects for Prisma (Connect/Disconnect)
            if ('customerID' in dataToUpdate) {
                // Use a proper disconnect method if dataToUpdate.customerID is null
                dataToUpdate.customer = dataToUpdate.customerID !== null
                    ? { connect: { id: dataToUpdate.customerID } }
                    : { disconnect: true }; // Use disconnect if null
                delete dataToUpdate.customerID;
            }
            // Repeat for other foreign keys (checking for existence in dataToUpdate)
            
            // ... (rest of your foreign key transformation logic remains the same)

            if ('startAddressID' in dataToUpdate) {
                dataToUpdate.addrStart = dataToUpdate.startAddressID !== null
                    ? { connect: { id: dataToUpdate.startAddressID } }
                    : { disconnect: true };
                delete dataToUpdate.startAddressID;
            }

            if ('endAddressID' in dataToUpdate) {
                dataToUpdate.addrEnd = dataToUpdate.endAddressID !== null
                    ? { connect: { id: dataToUpdate.endAddressID } }
                    : { disconnect: true };
                delete dataToUpdate.endAddressID;
            }

            if ('volunteerID' in dataToUpdate) {
                dataToUpdate.volunteer = dataToUpdate.volunteerID !== null
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
                    data: dataToUpdate,
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
        // Log the received data, which might have caused the initial JSON parsing error
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            data: updateData, // This helps debug if the error was outside the main logic block
        });
        return NextResponse.json({
            error: 'Failed to update ride',
            details: error.message || 'An unknown error occurred',
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
