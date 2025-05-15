// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const updateData = await request.json();
        console.log("Sending updateData:", updateData);
        console.log('Backend received updateData:', updateData);

        const ride = await prisma.ride.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        const { id: removedId, customerID, startAddressID, endAddressID, volunteerID, ...dataToUpdate } = updateData;
        const prismaUpdateData: any = { ...dataToUpdate };

        // Handle customer relation
        if (customerID === null) {
            prismaUpdateData.customer = { disconnect: true };
        } else if (customerID !== undefined) {
            prismaUpdateData.customer = { connect: { id: parseInt(customerID as string, 10) } };
        }

        // Handle start address relation
        if (startAddressID !== undefined) {
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
            return NextResponse.json({ message: 'Ride updated successfully', updatedRide });
        } else {
            return NextResponse.json({ message: 'No data to update' });
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
        return NextResponse.json({ error: 'Failed to update ride', details: error.message || error },{ status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}