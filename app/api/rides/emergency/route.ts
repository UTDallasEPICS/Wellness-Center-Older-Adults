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

    // Collect recipients: all active volunteers and admins
    const volunteerInfos = await prisma.volunteerInfo.findMany({
      where: { user: { isArchived: false } },
      include: { user: true },
    });

    const admins = await prisma.user.findMany({
      where: { isAdmin: true, isArchived: false },
      select: { email: true, firstName: true, lastName: true },
    });

    const recipientSet = new Set<string>();
    volunteerInfos.forEach(v => { if (v.user?.email) recipientSet.add(v.user.email); });
    admins.forEach(a => { if (a.email) recipientSet.add(a.email); });

    const recipients = Array.from(recipientSet);

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, message: 'No volunteer or admin email recipients configured' });
    }

    const subject = `🚨 EMERGENCY: Ride within 24hrs – ${foundRide.customer?.firstName || ''} ${foundRide.customer?.lastName || ''}`;

    const appointmentTime = foundRide.pickupTime instanceof Date
      ? foundRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      : String(foundRide.pickupTime);

    const appointmentDate = foundRide.date instanceof Date
      ? foundRide.date.toLocaleDateString()
      : String(foundRide.date);

    const address = foundRide.addrStart ? `${foundRide.addrStart.street}, ${foundRide.addrStart.city}, ${foundRide.addrStart.state} ${foundRide.addrStart.postalCode}` : 'N/A';

    await sendEmail({
        //process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.EMAIL_USER || 
      to: process.env.NOTIFY_EMAIL,
      bcc: recipients.join(','),
      subject,
      text: `Emergency Ride Alert!\n\nClient: ${foundRide.customer?.firstName || ''} ${foundRide.customer?.lastName || ''}\nPhone: ${foundRide.customer?.customerPhone || ''}\nAddress: ${address}\nAppointment Time: ${appointmentTime} on ${appointmentDate}\n\nVolunteer needs immediate notification.`,
    });



    return NextResponse.json({ success: true });

  } catch (error: unknown) {
        console.error("Emergency email error:", error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, message });
    }
  finally {
    try { await prisma.$disconnect(); } catch (e) { /* ignore disconnect errors */ }
  }
}
