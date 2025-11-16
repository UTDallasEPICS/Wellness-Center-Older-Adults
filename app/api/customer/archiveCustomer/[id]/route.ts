import { NextResponse } from 'next/server';
//import { PrismaClient } from '@prisma/client';

import prisma from "../../../../../util/prisma-client";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const clientId = params.id;
    
    // 1. Get the new status (isArchived: true/false) from the request body
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { isArchived } = body;

    // Basic validation
    if (typeof isArchived !== 'boolean') {
        return NextResponse.json({ error: 'Missing or invalid isArchived status in request body' }, { status: 400 });
    }

    try {
        // 2. Convert clientId to number (Prisma uses numbers for auto-increment IDs by default)
        const id = parseInt(clientId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid client ID format' }, { status: 400 });
        }

        // 3. Update the client record in the database
        const updatedClient = await prisma.customer.update({
            where: { id: id },
            data: {
                isArchived: isArchived,
            },
            include: {
                address: true,
            }
        });

        const statusAction = isArchived ? 'archived' : 'restored';
        console.log(`Client ${id} successfully ${statusAction}.`);

        // 4. Return the updated client data
        return NextResponse.json(updatedClient, { status: 200 });
        
    } catch (error) {
        // if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        //     return NextResponse.json({ message: 'Client not found.' }, { status: 404 });
        // }
        
        // console.error('Error updating client archive status:', error);
        // return NextResponse.json(
        //     { error: `Failed to update client status: ${error.message}` },
        //     { status: 500 }
        // );

        // Check if the error is a Prisma "record not found"
        if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
            return NextResponse.json({ message: "Client not found." }, { status: 404 });
        }

        // Generic error handling
        if (error instanceof Error) {
            console.error("Error updating client archive status:", error);
            return NextResponse.json(
                { error: `Failed to update client status: ${error.message}` },
                { status: 500 }
            );
        }

        // Fallback for non-Error unknown values
        console.error("Unknown error:", error);
        return NextResponse.json(
            { error: "An unknown error occurred." },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}