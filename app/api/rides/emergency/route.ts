// app/api/emergency/route.js

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient} from '@prisma/client';
import { sendEmail } from "@/util/nodemail";

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ride = body;

    if (!ride) {
      return NextResponse.json({ success: false, message: "Missing ride data" });
    }

    // Ensure ride exists and has correct structure
    const foundRide = await prisma.ride.findUnique({
        where: { id: ride.id },
            include: {
                customer: true,      // include the Customer object
                addrStart: true      // include the starting Address object
        }
    });

    if (!foundRide) {
      return NextResponse.json({ success: false, message: "Ride not found" });
    }

    // Validate the < 24hrs rule server-side
    const rideTime = foundRide.pickupTime;
    const now = new Date();
    const hoursDiff = (rideTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json({
        success: false,
        message: "Emergency allowed only within 24 hours"
      });
    }

    // 🔥 Send emergency notification email
    await sendEmail({
    to: process.env.NOTIFY_EMAIL,
    subject: `🚨 EMERGENCY: Ride within 24hrs – ${foundRide.customer?.firstName} ${foundRide.customer?.lastName}`,
    text: `
        Emergency Ride Alert!

        Client: ${foundRide.customer?.firstName} ${foundRide.customer?.lastName}
        Phone: ${foundRide.customer?.customerPhone}
        Address: ${foundRide.addrStart.street}, ${foundRide.addrStart.city}, ${foundRide.addrStart.state} ${foundRide.addrStart.postalCode}
        Appointment Time: ${foundRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} on ${foundRide.date.toLocaleDateString()}

        Volunteer needs immediate notification.
    `
});



    return NextResponse.json({ success: true });

  } catch (error: unknown) {
        console.error("Emergency email error:", error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, message });
    }
}
