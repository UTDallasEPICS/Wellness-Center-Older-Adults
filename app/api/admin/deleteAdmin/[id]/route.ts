// app/api/admin/deleteAdmin/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const adminId = parseInt(params.id, 10);

    if (isNaN(adminId)) {
        return NextResponse.json({ message: 'Invalid admin ID' }, { status: 400 });
    }

    try {
        const existingAdmin = await prisma.user.findUnique({
            where: {
                id: adminId,
                isAdmin: true,
                isArchived: false,
            },
        });

        if (!existingAdmin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        const deletedAdmin = await prisma.user.update({
            where: {
                id: adminId,
            },
            data: {
                isArchived: true,
            },
        });

        return NextResponse.json({ message: 'Admin deleted successfully', deletedAdmin }, { status: 200 });

    } catch (error: any) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ message: 'Failed to delete admin', error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}