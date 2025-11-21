// app/api/rides/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Helper function to parse address string
function parseAddressString(addressString: string) {
    const parts = addressString.split(', ');
    if (parts.length >= 3) {
        const street = parts[0];
        const city = parts[1];
        const stateZip = parts[2].split(' ');
        const state = stateZip[0];
        const postalCode = stateZip.slice(1).join(' ');

        return { street, city, state, postalCode };
    }
    return null;
}


// Helper function to send unreserve email
async function sendUnreserveEmail(volunteerEmail: string, rideDetails: any) {
    try {
        // Dynamic import (important for Next.js Serverless)
        const { default: nodemailer } = await import("nodemailer");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: volunteerEmail,
            subject: "Ride Unreserved",
            text: `
Hello,

The ride you previously reserved has been unreserved.

Date: ${rideDetails?.date ? rideDetails.date.toDateString() : "N/A"}
Pickup: ${rideDetails?.addrStart?.street || ""}
Dropoff: ${rideDetails?.addrEnd?.street || ""}

Thank you.
`
        };

        await transporter.sendMail(mailOptions);

        console.log("Unreserve email sent to:", volunteerEmail);
    } catch (err) {
        console.error("Error sending unreserve email:", err);
        throw err;
    }
}






export { sendUnreserveEmail };

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const updateData = await request.json();
        
        console.log("=== RECEIVED UPDATE DATA ===");
        console.log("Status:", updateData.status);
        console.log("Drive Time (from FE modal, via driveTimeAB):", updateData.driveTimeAB); // New log for modal data
        console.log("Notes (from FE modal, via notes):", updateData.notes);         // New log for modal data
        console.log("Full updateData:", updateData);

        const ride = await prisma.ride.findUnique({
            where: {
                id: parseInt(id, 10),
            },
            include: {
                volunteer: { include: { user: true } }
            }
        });

        


        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        console.log("=== EMAIL CONDITION CHECK ===");
        console.log("Original ride status:", ride.status);
        console.log("Updated ride status:", updateData.status);
        console.log("Original ride has volunteer:", ride.volunteerID);
        console.log("Original ride volunteer email:", ride.volunteer?.user?.email); 


        // --- RIDE COMPLETION VALIDATION (Check for Total Time) ---
        if (updateData.status === 'Completed') {
            // updateData.driveTimeAB is the field name sent by the frontend's handleSaveCompletion
            if (!updateData.driveTimeAB) {
                return NextResponse.json(
                    { error: 'Cannot complete ride. Total drive time is required.' },
                    { status: 400 }
                );
            }
        }
        // --- END COMPLETION VALIDATION ---

        // Handle Address String Updates (retaining original complex logic)
        if (updateData.pickupAddress || updateData.dropoffAddress) {
            
            // Parse pickup address
            if (updateData.pickupAddress && ride.startAddressID) {
                const pickupParts = parseAddressString(updateData.pickupAddress);
                if (pickupParts) {
                    await prisma.address.update({
                        where: { id: ride.startAddressID },
                        data: pickupParts
                    });
                }
            }
            
            // Parse dropoff address  
            if (updateData.dropoffAddress && ride.endAddressID) {
                const dropoffParts = parseAddressString(updateData.dropoffAddress);
                if (dropoffParts) {
                    await prisma.address.update({
                        where: { id: ride.endAddressID },
                        data: dropoffParts
                    });
                }
            }
        }

        // Handle customer updates if provided (retaining original logic)
        if (updateData.customerUpdates) {
            const customer = await prisma.customer.findUnique({
                where: { id: parseInt(updateData.customerUpdates.id, 10) },
            });
            if (customer) {
                await prisma.customer.update({
                    where: { id: parseInt(updateData.customerUpdates.id, 10) },
                    data: {
                        firstName: updateData.customerUpdates.firstName,
                        lastName: updateData.customerUpdates.lastName,
                        customerPhone: updateData.customerUpdates.customerPhone,
                    },
                });
            }
        }

        // Handle address updates if provided (retaining original logic)
        if (updateData.addressUpdates) {
            const address = await prisma.address.findUnique({
                where: { id: parseInt(updateData.addressUpdates.id, 10) },
            });
            if (address) {
                await prisma.address.update({
                    where: { id: parseInt(updateData.addressUpdates.id, 10) },
                    data: {
                        street: updateData.addressUpdates.street,
                        city: updateData.addressUpdates.city,
                        state: updateData.addressUpdates.state,
                        postalCode: updateData.addressUpdates.postalCode,
                    },
                });
            }
        }

        // --- Build Prisma Update Data for Ride Model ---
        const { customerID, startAddressID, endAddressID, volunteerID, date, pickupTime, status, driveTimeAB, notes } = updateData;
        const prismaUpdateData: any = {};

        // Handle basic fields
        if (date !== undefined) {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                prismaUpdateData.date = parsedDate;
            }
        }
        
        if (pickupTime !== undefined) {
            const parsedPickupTime = new Date(pickupTime);
            if (!isNaN(parsedPickupTime.getTime())) {
                prismaUpdateData.pickupTime = parsedPickupTime;
            }
        }
        
        if (status !== undefined) prismaUpdateData.status = status;
        
        // MAPPING: driveTimeAB (FE payload) -> totalTime (Prisma field)
        if (driveTimeAB !== undefined) {
            prismaUpdateData.totalTime = driveTimeAB;
        }

        // MAPPING: notes (FE payload) -> specialNote (Prisma field)
        if (notes !== undefined) {
            prismaUpdateData.specialNote = notes;
        }

        // Handle relations (retaining original logic)
        if (customerID !== undefined) prismaUpdateData.customer = customerID === null ? { disconnect: true } : { connect: { id: parseInt(customerID as string, 10) } };
        if (startAddressID !== undefined) prismaUpdateData.addrStart = startAddressID === null ? { disconnect: true } : { connect: { id: parseInt(startAddressID as string, 10) } };
        if (endAddressID !== undefined) prismaUpdateData.addrEnd = endAddressID === null ? { disconnect: true } : { connect: { id: parseInt(endAddressID as string, 10) } };
        if (volunteerID !== undefined) prismaUpdateData.volunteer = volunteerID === null ? { disconnect: true } : { connect: { id: parseInt(volunteerID as string, 10) } };


        

        // Send email BEFORE updating the ride (while volunteer is still connected)
        if (ride.status === 'Reserved' && updateData.status === 'AVAILABLE' && ride.volunteer?.user?.email) {
            try {
                await sendUnreserveEmail(ride.volunteer.user.email, ride);
                console.log("Email sent successfully for ride unreservation");
            } catch (emailError) {
                console.error('Email notification failed, but ride update will proceed:', emailError);
                // Continue with ride update even if email fails
            }
        }

        let updatedRide;

        if (Object.keys(prismaUpdateData).length > 0) {
            updatedRide = await prisma.ride.update({
                where: { id: parseInt(id, 10) },
                data: prismaUpdateData,
                include: {
                    customer: true,
                    addrStart: true,
                    addrEnd: true,
                    volunteer: { include: { user: true } }
                }
            });

            return NextResponse.json({ 
                message: 'Ride updated successfully', 
                updatedRide,
                // Include formatted data for frontend
                formattedData: {
                    id: updatedRide.id,
                    customerID: updatedRide.customerID,
                    customerName: updatedRide.customer ? `${updatedRide.customer.firstName} ${updatedRide.customer.lastName}` : '',
                    customerPhone: updatedRide.customer?.customerPhone || '',
                    startAddressID: updatedRide.startAddressID,
                    endAddressID: updatedRide.endAddressID,
                    startLocation: updatedRide.addrStart ? `${updatedRide.addrStart.street}, ${updatedRide.addrStart.city}, ${updatedRide.addrStart.state} ${updatedRide.addrStart.postalCode}` : '',
                    endLocation: updatedRide.addrEnd ? `${updatedRide.addrEnd.street}, ${updatedRide.addrEnd.city}, ${updatedRide.addrEnd.state} ${updatedRide.addrEnd.postalCode}` : '',
                    date: updatedRide.date,
                    startTime: updatedRide.pickupTime ? updatedRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
                    status: updatedRide.status,
                    totalTime: updatedRide.totalTime,       // <-- Include new field
                    specialNote: updatedRide.specialNote    // <-- Include new field
                }
            }, { status: 200 });
        } else {
            // Handle case where no ride-specific fields were updated
            const rideWithUpdatedData = await prisma.ride.findUnique({
                where: { id: parseInt(id, 10) },
                include: {
                    customer: true,
                    addrStart: true,
                    addrEnd: true,
                    volunteer: { include: { user: true } }
                }
            });

            return NextResponse.json({ 
                message: 'No ride data to update, but related records may have been updated',
                updatedRide: rideWithUpdatedData,
                formattedData: rideWithUpdatedData ? {
                    id: rideWithUpdatedData.id,
                    customerID: rideWithUpdatedData.customerID,
                    customerName: rideWithUpdatedData.customer ? `${rideWithUpdatedData.customer.firstName} ${rideWithUpdatedData.customer.lastName}` : '',
                    customerPhone: rideWithUpdatedData.customer?.customerPhone || '',
                    startAddressID: rideWithUpdatedData.startAddressID,
                    endAddressID: rideWithUpdatedData.endAddressID,
                    startLocation: rideWithUpdatedData.addrStart ? `${rideWithUpdatedData.addrStart.street}, ${rideWithUpdatedData.addrStart.city}, ${rideWithUpdatedData.addrStart.state} ${rideWithUpdatedData.addrStart.postalCode}` : '',
                    endLocation: rideWithUpdatedData.addrEnd ? `${rideWithUpdatedData.addrEnd.street}, ${rideWithUpdatedData.addrEnd.city}, ${rideWithUpdatedData.addrEnd.state} ${rideWithUpdatedData.addrEnd.postalCode}` : '',
                    date: rideWithUpdatedData.date,
                    startTime: rideWithUpdatedData.pickupTime ? rideWithUpdatedData.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
                    status: rideWithUpdatedData.status,
                    totalTime: rideWithUpdatedData.totalTime,
                    specialNote: rideWithUpdatedData.specialNote
                } : null
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
        return NextResponse.json({ error: 'Failed to update ride', details: error.message || error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}