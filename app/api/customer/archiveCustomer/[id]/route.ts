import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
             // P2025 is Prisma's error code for "An operation failed because it depends on one or more records that were required but not found." (Record not found)
            return NextResponse.json({ message: 'Client not found.' }, { status: 404 });
        }
        
        console.error('Error updating client archive status:', error);
        return NextResponse.json(
            { error: `Failed to update client status: ${error.message}` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}