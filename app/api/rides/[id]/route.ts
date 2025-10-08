// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to parse address string
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

    try {
        const updateData = await request.json();
<<<<<<< HEAD
        console.log("Backend received updateData:", updateData);
=======
        
        console.log("=== RECEIVED UPDATE DATA ===");
        console.log("Date:", updateData.date);
        console.log("Pickup Time:", updateData.pickupTime);
        console.log("Start Address ID:", updateData.startAddressID);
        console.log("End Address ID:", updateData.endAddressID);
        console.log("Customer ID:", updateData.customerID);
        console.log("Volunteer ID:", updateData.volunteerID);
        console.log("Status:", updateData.status);
        console.log("Customer Updates:", updateData.customerUpdates);
        console.log("Address Updates:", updateData.addressUpdates);
        console.log("Full updateData:", updateData);
>>>>>>> workingNonChatbot

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

<<<<<<< HEAD
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
=======
        if (updateData.pickupAddress || updateData.dropoffAddress) {
            console.log("=== PARSING ADDRESS STRINGS ===");
            console.log("Pickup address string:", updateData.pickupAddress);
            console.log("Dropoff address string:", updateData.dropoffAddress);
            console.log("Ride startAddressID:", ride.startAddressID);
            console.log("Ride endAddressID:", ride.endAddressID);
            
            // Parse pickup address
            if (updateData.pickupAddress && ride.startAddressID) {
                console.log("Processing pickup address...");
                const pickupParts = parseAddressString(updateData.pickupAddress);
                console.log("Parsed pickup parts:", pickupParts);
                if (pickupParts) {
                    const updatedPickup = await prisma.address.update({
                        where: { id: ride.startAddressID },
                        data: pickupParts
                    });
                    console.log("Updated pickup address in DB:", updatedPickup);
                }
            }
            
            // Parse dropoff address  
            if (updateData.dropoffAddress && ride.endAddressID) {
                console.log("Processing dropoff address...");
                const dropoffParts = parseAddressString(updateData.dropoffAddress);
                console.log("Parsed dropoff parts:", dropoffParts);
                if (dropoffParts) {
                    const updatedDropoff = await prisma.address.update({
                        where: { id: ride.endAddressID },
                        data: dropoffParts
                    });
                    console.log("Updated dropoff address in DB:", updatedDropoff);
                }
            }
        }

        // Handle customer updates if provided
        if (updateData.customerUpdates) {
            console.log("=== CUSTOMER UPDATE ===");
            console.log("Customer ID:", updateData.customerUpdates.id);
            console.log("Update data:", updateData.customerUpdates);

            const customer = await prisma.customer.findUnique({
                where: {
                    id: parseInt(updateData.customerUpdates.id, 10),
                },
            });

            if (customer) {
                const updatedCustomer = await prisma.customer.update({
                    where: {
                        id: parseInt(updateData.customerUpdates.id, 10),
                    },
                    data: {
                        firstName: updateData.customerUpdates.firstName,
                        lastName: updateData.customerUpdates.lastName,
                        customerPhone: updateData.customerUpdates.customerPhone,
                    },
                });
                console.log("Updated customer:", updatedCustomer);
            } else {
                console.log("Customer not found for update");
            }
        }

        if (updateData.addressUpdates) {
            console.log("=== ADDRESS UPDATE ===");
            console.log("Address ID:", updateData.addressUpdates.id);
            console.log("Update data:", updateData.addressUpdates);

            const address = await prisma.address.findUnique({
                where: {
                    id: parseInt(updateData.addressUpdates.id, 10),
                },
            });

            if (address) {
                const updatedAddress = await prisma.address.update({
                    where: {
                        id: parseInt(updateData.addressUpdates.id, 10),
                    },
                    data: {
                        street: updateData.addressUpdates.street,
                        city: updateData.addressUpdates.city,
                        state: updateData.addressUpdates.state,
                        postalCode: updateData.addressUpdates.postalCode,
                    },
                });
                console.log("Updated address:", updatedAddress);
            } else {
                console.log("Address not found for update");
            }
        }

        // Extract the fields that should be updated on the ride record
        const { customerID, startAddressID, endAddressID, volunteerID, date, pickupTime, status } = updateData;
        const prismaUpdateData: any = {};

        // Handle basic fields with enhanced logging for pickup time
        if (date !== undefined) {
            console.log("=== DATE PROCESSING ===");
            console.log("Original date string:", date);
            const parsedDate = new Date(date);
            console.log("Parsed date:", parsedDate);
            console.log("Parsed date ISO:", parsedDate.toISOString());
            prismaUpdateData.date = parsedDate;
        }
        
        if (pickupTime !== undefined) {
            console.log("=== PICKUP TIME PROCESSING ===");
            console.log("Original pickupTime string:", pickupTime);
            console.log("Type of pickupTime:", typeof pickupTime);
            const parsedPickupTime = new Date(pickupTime);
            console.log("Parsed pickupTime:", parsedPickupTime);
            console.log("Parsed pickupTime ISO:", parsedPickupTime.toISOString());
            console.log("Is parsed date valid?", !isNaN(parsedPickupTime.getTime()));
            prismaUpdateData.pickupTime = parsedPickupTime;
        }
        
        if (status !== undefined) prismaUpdateData.status = status;
        
        // Handle notes field
        if (updateData.notes !== undefined) {
            console.log("=== NOTES PROCESSING ===");
            console.log("Original notes:", updateData.notes);
            prismaUpdateData.specialNote = updateData.notes;
        }

        // Handle customer relation
        if (customerID === null) {
            prismaUpdateData.customer = { disconnect: true };
        } else if (customerID !== undefined) {
            prismaUpdateData.customer = { connect: { id: parseInt(customerID as string, 10) } };
        }

        // Handle start address relation
        if (startAddressID === null) {
            prismaUpdateData.addrStart = { disconnect: true };
        } else if (startAddressID !== undefined) {
            prismaUpdateData.addrStart = { connect: { id: parseInt(startAddressID as string, 10) } };
        }

        // Handle end address relation
        if (endAddressID === null) {
            prismaUpdateData.addrEnd = { disconnect: true };
        } else if (endAddressID !== undefined) {
            prismaUpdateData.addrEnd = { connect: { id: parseInt(endAddressID as string, 10) } };
        }

        // Handle volunteer relation
        if (volunteerID === null) {
            prismaUpdateData.volunteer = { disconnect: true };
        } else if (volunteerID !== undefined) {
            prismaUpdateData.volunteer = { connect: { id: parseInt(volunteerID as string, 10) } };
>>>>>>> workingNonChatbot
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

<<<<<<< HEAD
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
=======
        if (Object.keys(prismaUpdateData).length > 0) {
            updatedRide = await prisma.ride.update({
                where: {
                    id: parseInt(id, 10),
                },
                data: prismaUpdateData,
                include: {
                    customer: true,
                    addrStart: true,
                    addrEnd: true,
                    volunteer: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            // Enhanced logging for sending data
            console.log("=== SENDING RESPONSE DATA ===");
            console.log("Updated Ride Date:", updatedRide.date);
            console.log("Updated Ride Pickup Time:", updatedRide.pickupTime);
            console.log("Updated Ride Start Address ID:", updatedRide.startAddressID);
            console.log("Updated Ride End Address ID:", updatedRide.endAddressID);
            console.log("Updated Ride Customer ID:", updatedRide.customerID);
            console.log("Updated Ride Status:", updatedRide.status);
            console.log("Updated Address Start:", updatedRide.addrStart);
            console.log("Updated Address End:", updatedRide.addrEnd);
            console.log("Full updatedRide:", updatedRide);

            return NextResponse.json({ 
                message: 'Ride updated successfully', 
                updatedRide,
                // Include formatted data for frontend
                formattedData: {
                    id: updatedRide.id,
                    customerID: updatedRide.customerID,
                    customerName: updatedRide.customer ? `${updatedRide.customer.firstName} ${updatedRide.customer.lastName}` : '',
                    customerPhone: updatedRide.customer?.customerPhone || '',
                    startAddressID: updatedRide.startAddressID,
                    endAddressID: updatedRide.endAddressID,
                    startLocation: updatedRide.addrStart ? `${updatedRide.addrStart.street}, ${updatedRide.addrStart.city}, ${updatedRide.addrStart.state} ${updatedRide.addrStart.postalCode}` : '',
                    endLocation: updatedRide.addrEnd ? `${updatedRide.addrEnd.street}, ${updatedRide.addrEnd.city}, ${updatedRide.addrEnd.state} ${updatedRide.addrEnd.postalCode}` : '',
                    date: updatedRide.date,
                    startTime: updatedRide.pickupTime ? updatedRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
                    status: updatedRide.status
                }
            });
        } else {
            const rideWithUpdatedData = await prisma.ride.findUnique({
                where: {
                    id: parseInt(id, 10),
                },
                include: {
                    customer: true,
                    addrStart: true,
                    addrEnd: true,
                    volunteer: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return NextResponse.json({ 
                message: 'No ride data to update, but related records may have been updated',
                updatedRide: rideWithUpdatedData,
                formattedData: rideWithUpdatedData ? {
                    id: rideWithUpdatedData.id,
                    customerID: rideWithUpdatedData.customerID,
                    customerName: rideWithUpdatedData.customer ? `${rideWithUpdatedData.customer.firstName} ${rideWithUpdatedData.customer.lastName}` : '',
                    customerPhone: rideWithUpdatedData.customer?.customerPhone || '',
                    startAddressID: rideWithUpdatedData.startAddressID,
                    endAddressID: rideWithUpdatedData.endAddressID,
                    startLocation: rideWithUpdatedData.addrStart ? `${rideWithUpdatedData.addrStart.street}, ${rideWithUpdatedData.addrStart.city}, ${rideWithUpdatedData.addrStart.state} ${rideWithUpdatedData.addrStart.postalCode}` : '',
                    endLocation: rideWithUpdatedData.addrEnd ? `${rideWithUpdatedData.addrEnd.street}, ${rideWithUpdatedData.addrEnd.city}, ${rideWithUpdatedData.addrEnd.state} ${rideWithUpdatedData.addrEnd.postalCode}` : '',
                    date: rideWithUpdatedData.date,
                    startTime: rideWithUpdatedData.pickupTime ? rideWithUpdatedData.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
                    status: rideWithUpdatedData.status
                } : null
            });
>>>>>>> workingNonChatbot
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
<<<<<<< HEAD
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            data: updateData,
        });
        return NextResponse.json({
            error: 'Failed to update ride',
            details: error.message || 'An unknown error occurred',
        }, { status: 500 });
=======
        return NextResponse.json({ error: 'Failed to update ride', details: error.message || error }, { status: 500 });
>>>>>>> workingNonChatbot
    } finally {
        await prisma.$disconnect();
    }
}