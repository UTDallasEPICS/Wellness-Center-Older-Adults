import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const currentYear = new Date().getFullYear()

    const data = await prisma.ride.groupBy({
      by: ['customerID'],
      _count: { id: true },
      where: {
        customerID: { not: null },
        date: {
          gte: new Date(`${currentYear}-01-01`)
        }
      },
      orderBy: {
        _count: { id: 'desc' }
      },
      take: 5
    })

    const customers = await Promise.all(
      data.map(async (entry) => {
        const customer = await prisma.customer.findUnique({
          where: { id: entry.customerID! }
        })
        return {
          id: entry.customerID,
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          rideCount: entry._count.id
        }
      })
    )

    return NextResponse.json(customers)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
