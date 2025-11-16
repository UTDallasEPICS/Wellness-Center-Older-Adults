// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
//import { PrismaClient } from '@prisma/client';

import prisma from "../../../../../util/prisma-client";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const updateData = await request.json();
        
        // Enhanced logging for received data
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

        const ride = await prisma.ride.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
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

        // Handle address updates if provided
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

        // Handle basic fields
        if (date !== undefined) prismaUpdateData.date = new Date(date);
        if (pickupTime !== undefined) prismaUpdateData.pickupTime = new Date(pickupTime);
        if (status !== undefined) prismaUpdateData.status = status;

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
        }

        let updatedRide;

        if (Object.keys(prismaUpdateData).length > 0) {
            updatedRide = await prisma.ride.update({
                where: {
                    id: parseInt(id, 10),
                },
                data: prismaUpdateData,
            });

            // Enhanced logging for sending data
            console.log("=== SENDING RESPONSE DATA ===");
            console.log("Updated Ride Date:", updatedRide.date);
            console.log("Updated Ride Pickup Time:", updatedRide.pickupTime);
            console.log("Updated Ride Start Address ID:", updatedRide.startAddressID);
            console.log("Updated Ride End Address ID:", updatedRide.endAddressID);
            console.log("Updated Ride Customer ID:", updatedRide.customerID);
            console.log("Updated Ride Status:", updatedRide.status);
            console.log("Full updatedRide:", updatedRide);

            return NextResponse.json({ message: 'Ride updated successfully', updatedRide });
        } else {
            return NextResponse.json({ message: 'No ride data to update, but related records may have been updated' });
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
        return NextResponse.json({ error: 'Failed to update ride', details: error.message || error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}