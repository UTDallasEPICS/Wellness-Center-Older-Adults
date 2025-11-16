// app/api/customer/deleteCustomer/[id]/route.ts
//import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from "../../../../../util/prisma-client";

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
        if (existingCustomer.rides.length > 0) {
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