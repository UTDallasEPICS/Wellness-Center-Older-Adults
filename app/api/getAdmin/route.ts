// app/api/getAdmin/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const admins = await prisma.user.findMany({
            where: {
                isAdmin: true,
                isArchived: false,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
            },
        });

        return NextResponse.json(admins, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ message: 'Failed to fetch admins', error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}