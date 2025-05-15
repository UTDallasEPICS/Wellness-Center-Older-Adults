// app/api/customer/deleteCustomer/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const customerId = parseInt(params.id, 10);

    if (isNaN(customerId)) {
        return NextResponse.json({ status: 400, message: 'Invalid customer ID' }, { status: 400 });
    }

    try {
        const existingCustomer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                rides: true, // Include rides to handle potential foreign key constraints
            },
        });

        if (!existingCustomer) {
            return NextResponse.json({ status: 404, message: 'Customer not found' }, { status: 404 });
        }

        // Consider deleting related rides first if necessary, depending on your requirements
        // and Prisma schema onDelete rules. If you have onDelete: Cascade set on the relation,
        // Prisma will handle the deletion of related rides automatically.
        if (existingCustomer.rides.length > 0) {
            // If you don't have onDelete: Cascade, you might want to handle this explicitly
            // For example, you could return an error or delete the rides first.
            // This example assumes onDelete: Cascade or that you want to allow deletion
            // even if rides exist (which might lead to data inconsistencies if not handled).
            // A safer approach might be to archive rides or prevent deletion if active rides exist.
            console.warn(`Customer ${customerId} has associated rides. Ensure your onDelete strategy is appropriate.`);
        }

        const deletedCustomer = await prisma.customer.delete({
            where: { id: customerId },
        });

        return NextResponse.json({ status: 200, message: 'Customer deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting customer:', error);

        if (error.code === 'P2025') {
            return NextResponse.json({ status: 404, message: 'Customer not found' }, { status: 404 });
        } else if (error.code === 'P2003' && error.meta?.field_name === 'customerID') {
            return NextResponse.json({
                status: 400,
                message: 'Cannot delete customer with existing rides. Please archive or delete the rides first.',
            }, { status: 400 });
        }

        return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}