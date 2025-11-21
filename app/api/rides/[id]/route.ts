import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/util/nodemail';
import { SendMailOptions } from 'nodemailer';
import { cookies } from 'next/headers';
import { jwtVerify, importX509 } from 'jose';

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const VOLUNTEER_EMAIL = process.env.VOLUNTEER_EMAIL;

// Helper function to get current user email from JWT token
async function getCurrentUserEmail(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        const id_token = cookieStore.get('cvtoken')?.value;

        if (!id_token) {
            return null;
        }

        const certPem = process.env.CERT_PEM;
        if (!certPem) {
            console.error('CERT_PEM environment variable not found');
            return null;
        }

        const key = await importX509(certPem, 'RS256');
        const decoded = await jwtVerify(id_token, key);
        
        return (decoded.payload.email as string) || null;
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return null;
    }
}

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

// GET - Fetch a single ride by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const ride = await prisma.ride.findUnique({
            where: {
                id: parseInt(id, 10),
            },
            include: {
                customer: true,
                addrStart: true,
                addrEnd: true,
                volunteer: { include: { user: true } }
            }
        });

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        const formattedRide = {
            id: ride.id,
            customerID: ride.customerID,
            customer: {
                name: ride.customer ? `${ride.customer.firstName} ${ride.customer.lastName}` : '',
                phone: ride.customer?.customerPhone || ''
            },
            pickupAddress: ride.addrStart ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` : '',
            dropoffAddress: ride.addrEnd ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` : '',
            date: ride.date.toISOString(),
            pickupTime: ride.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            driveTimeAB: ride.totalTime || '',
            totalTime: ride.totalTime || '',
            waitTime: typeof (ride as any).waitTime === 'number' ? (ride as any).waitTime : 0,
            mileage: '',
            notes: ride.specialNote || '',
            status: ride.status,
            volunteerName: ride.volunteer?.user ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` : ''
        };

        return NextResponse.json(formattedRide, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching ride:', error);
        return NextResponse.json({ error: 'Failed to fetch ride', details: error.message || error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set.");
    }

    try {
        const updateData = await request.json();
        console.log('[RideUpdate] PUT hit', {
          id,
          bodyKeys: Object.keys(updateData || {}),
          status: updateData?.status,
        });

        const ride = await prisma.ride.findUnique({
            where: {
                id: parseInt(id, 10),
            },
            include: {
                customer: true,
                addrStart: true,
                addrEnd: true,
                volunteer: { include: { user: true } }
            }
        });

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        const isReserving = ride.status !== "Reserved" && updateData.status === "Reserved";

        // NEW: If a volunteer is reserving this ride, auto-assign them
        let assignedVolunteerID = updateData.volunteerID;
        if (isReserving && !assignedVolunteerID) {
            const userEmail = await getCurrentUserEmail();
            if (userEmail) {
                const volunteerInfo = await prisma.volunteerInfo.findFirst({
                    where: {
                        user: {
                            email: userEmail,
                        },
                    },
                });
                if (volunteerInfo) {
                    assignedVolunteerID = volunteerInfo.id;
                    console.log(`[RideUpdate] Auto-assigning volunteer ${volunteerInfo.id} (${userEmail}) to ride ${id}`);
                }
            }
        }

        const isCompletion = updateData.status === 'Completed';
        const isCancellation = updateData.status === 'Cancelled';

        if (isCompletion) {
            if (!updateData.driveTimeAB) {
                return NextResponse.json(
                    { error: 'Cannot complete ride. Total drive time is required.' },
                    { status: 400 }
                );
            }
        }

        if (updateData.pickupAddress || updateData.dropoffAddress) {
            
            if (updateData.pickupAddress && ride.startAddressID) {
                const pickupParts = parseAddressString(updateData.pickupAddress);
                if (pickupParts) {
                    await prisma.address.update({
                        where: { id: ride.startAddressID },
                        data: pickupParts
                    });
                }
            }
            
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

        // Extract fields including waitTime
        const { 
            customerID, 
            startAddressID, 
            endAddressID, 
            date, 
            pickupTime, 
            status, 
            driveTimeAB, 
            waitTime,
            notes 
        } = updateData;
        
        const prismaUpdateData: any = {};

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
        
        if (driveTimeAB !== undefined) {
            prismaUpdateData.totalTime = driveTimeAB;
        }

        // Handle waitTime as Float
        if (waitTime !== undefined) {
            prismaUpdateData.waitTime = waitTime !== null && waitTime !== '' 
                ? Number(waitTime) 
                : 0;
        }

        if (notes !== undefined) {
            prismaUpdateData.specialNote = notes;
        }

        if (customerID !== undefined) prismaUpdateData.customer = customerID === null ? { disconnect: true } : { connect: { id: parseInt(customerID as string, 10) } };
        if (startAddressID !== undefined) prismaUpdateData.addrStart = startAddressID === null ? { disconnect: true } : { connect: { id: parseInt(startAddressID as string, 10) } };
        if (endAddressID !== undefined) prismaUpdateData.addrEnd = endAddressID === null ? { disconnect: true } : { connect: { id: parseInt(endAddressID as string, 10) } };
        
        // Use the assigned volunteer ID (either from updateData or auto-assigned)
        if (assignedVolunteerID !== undefined) {
            prismaUpdateData.volunteer = assignedVolunteerID === null 
                ? { disconnect: true } 
                : { connect: { id: parseInt(assignedVolunteerID as string, 10) } };
        }

        let updatedRide;
        let finalFormattedData = null;

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

            finalFormattedData = {
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
                totalTime: updatedRide.totalTime,
                waitTime: (updatedRide as any).waitTime !== null ? (updatedRide as any).waitTime : 0,
                specialNote: updatedRide.specialNote,
                volunteerName: updatedRide.volunteer?.user ? `${updatedRide.volunteer.user.firstName} ${updatedRide.volunteer.user.lastName}` : ''
            };

            const volunteerEmail = updatedRide.volunteer?.user?.email || undefined;
            const recipients: string[] = [];
            if (ADMIN_EMAIL) recipients.push(ADMIN_EMAIL);
            if (volunteerEmail) recipients.push(volunteerEmail);
            const recipientsUnique = Array.from(new Set(recipients.filter(Boolean)));
            const dateString = new Date(updatedRide.date).toLocaleDateString();
            const timeString = updatedRide.pickupTime ? updatedRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';
            console.log('[RideUpdateEmail] Recipients resolved (unique):', recipientsUnique);

            // Reservation confirmation to assigned volunteer when status becomes Reserved
            if (isReserving && volunteerEmail && sendEmail) {
                const mailOptions: SendMailOptions = {
                    to: volunteerEmail,
                    subject: `Ride Confirmation: Ride #${updatedRide.id} Reserved` ,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #3b82f6;">
                            <h2 style="font-size: 24px; color: #3b82f6; margin-top: 0;">Ride Reservation Confirmed!</h2>
                            <p>Thank you for reserving a ride! Here are the details for your upcoming trip:</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Ride ID:</strong> #${updatedRide.id}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${dateString}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Pick-up Time:</strong> ${timeString}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Pick-up Address:</strong> ${finalFormattedData.startLocation}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Drop-off Address:</strong> ${finalFormattedData.endLocation}</td></tr>
                            </table>
                            <p style="font-size: 14px; color: #718096;">Please review the details in your dashboard.</p>
                        </div>
                    `,
                };
                try {
                    await sendEmail(mailOptions);
                    console.log(`Volunteer reservation email sent for ride ${updatedRide.id} to ${volunteerEmail}.`);
                } catch (emailError) {
                    console.error(`ERROR: Failed to send volunteer reservation email for ride ${updatedRide.id}:`, emailError);
                }
            }

            // Editing a ride while Reserved: always email recipients about the edit
            const wasReserved = ride.status === 'Reserved';
            const isStillReserved = updatedRide.status === 'Reserved';
            if (wasReserved && isStillReserved && sendEmail) {
                if (recipientsUnique.length === 0) {
                    console.warn(`[RideUpdateEmail] No recipients found for reserved ride update ${updatedRide.id}.`);
                } else {
                    // Debounce duplicate sends that can happen if the client issues two quick PUTs
                    const g: any = global as any;
                    if (!g._recentRideEmailDebounce) g._recentRideEmailDebounce = new Map<string, number>();
                    const recentMap: Map<string, number> = g._recentRideEmailDebounce;
                    const key = `update:${updatedRide.id}`;
                    const now = Date.now();
                    const last = recentMap.get(key) || 0;
                    if (now - last < 4000) {
                        console.log(`[RideUpdateEmail] Skipping duplicate update email for ride ${updatedRide.id} (debounced)`);
                    } else {
                        recentMap.set(key, now);
                        const mailOptions: SendMailOptions = {
                            to: recipientsUnique,
                            subject: `Ride Updated: Ride #${updatedRide.id} (Reserved)`,
                            html: `
                                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;">
                                    <h2 style="font-size: 24px; color: #0da000; margin-top: 0;">Reserved Ride Details Updated</h2>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                        <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                        <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${dateString}</td></tr>
                                        <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Pick-up Time:</strong> ${timeString}</td></tr>
                                        <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Pick-up Address:</strong> ${finalFormattedData.startLocation}</td></tr>
                                        <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Drop-off Address:</strong> ${finalFormattedData.endLocation}</td></tr>
                                        ${(updatedRide as any).waitTime ? `<tr><td style=\"padding: 5px 0;\"><strong style=\"color: #4a5568;\">Wait Time:</strong> ${(updatedRide as any).waitTime} hours</td></tr>` : ''}
                                    </table>
                                    ${updatedRide.specialNote ? `<p style=\"font-weight: bold; margin-bottom: 8px; color: #1a202c;\">Notes:</p><div style=\"background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;\">${updatedRide.specialNote}</div>` : ''}
                                </div>
                            `,
                        };
                        try {
                            await sendEmail(mailOptions);
                            console.log(`Update email sent for reserved ride ${updatedRide.id} to ${recipientsUnique.join(', ')}.`);
                        } catch (emailError) {
                            console.error(`ERROR: Failed to send reserved ride update email for ride ${updatedRide.id}:`, emailError);
                        }
                    }
                }
            }

            // --- CANCELLATION EMAIL LOGIC START ---
            if (isCancellation && updatedRide.customer && sendEmail) {
                const cancelRecipients = recipientsUnique;
                if (cancelRecipients.length > 0) {
                    const mailOptions: SendMailOptions = {
                        to: cancelRecipients,
                        subject: `RIDE CANCELLED: ${finalFormattedData.customerName} on ${new Date(updatedRide.date).toLocaleDateString()}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cc0000;">
                                <h2 style="font-size: 24px; color: #cc0000; margin-top: 0;">Ride Has Been Cancelled</h2>
                                <p>The following ride has been marked as CANCELLED.</p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${new Date(updatedRide.date).toLocaleDateString()}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Time:</strong> ${finalFormattedData.startTime}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Status:</strong> <span style="color: #cc0000; font-weight: bold;">CANCELLED</span></td></tr>
                                </table>
                                <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
                                <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                                    <strong>Pickup:</strong> ${finalFormattedData.startLocation} <br/>
                                    <strong>Dropoff:</strong> ${finalFormattedData.endLocation}
                                </div>
                                ${updatedRide.specialNote ? `<p style=\"font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;\">Notes:</p><div style=\"background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;\">${updatedRide.specialNote}</div>` : ''}
                            </div>
                        `,
                    };
                    try {
                        await sendEmail(mailOptions);
                        console.log(`Email sent for cancelled ride ${updatedRide.id} to ${cancelRecipients.join(', ')}`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send cancellation email for ride ${updatedRide.id}:`, emailError);
                    }
                } else {
                    console.warn(`Cancellation email not sent for ride ${updatedRide.id}: No valid ADMIN/VOLUNTEER recipients found.`);
                }
            }
            // --- CANCELLATION EMAIL LOGIC END ---

            // Existing Completion Logic (send to admin and assigned volunteer if available)
            if (isCompletion && updatedRide.customer && sendEmail) {
                const completeRecipients = recipientsUnique;
                if (completeRecipients.length > 0) {
                    const mailOptions: SendMailOptions = {
                        to: completeRecipients,
                        subject: `Ride Completed: ${finalFormattedData.customerName}`,
                        html: `
                            <div style=\"font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;\">
                                <h2 style=\"font-size: 24px; color: #0da000; margin-top: 0;\">Ride Marked as Complete</h2>
                                <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"margin-bottom: 20px;\">
                                    <tr><td style=\"padding: 5px 0;\"><strong style=\"color: #4a5568;\">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                    <tr><td style=\"padding: 5px 0;\"><strong style=\"color: #4a5568;\">Date:</strong> ${new Date(updatedRide.date).toLocaleDateString()}</td></tr>
                                    <tr><td style=\"padding: 5px 0;\"><strong style=\"color: #4a5568;\">Time:</strong> ${finalFormattedData.startTime}</td></tr>
                                    ${updatedRide.totalTime ? `<tr><td style=\\"padding: 5px 0;\\"><strong style=\\"color: #4a5568;\\">Total Drive Time:</strong> ${updatedRide.totalTime}</td></tr>` : ''}
                                    ${(updatedRide as any).waitTime ? `<tr><td style=\\"padding: 5px 0;\\"><strong style=\\"color: #4a5568;\\">Wait Time:</strong> ${(updatedRide as any).waitTime} hours</td></tr>` : ''}
                                </table>
                                <p style=\"font-weight: bold; margin-bottom: 8px; color: #1a202c;\">Ride Route:</p>
                                <div style=\"background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;\">
                                    <strong>Pickup:</strong> ${finalFormattedData.startLocation} <br/>
                                    <strong>Dropoff:</strong> ${finalFormattedData.endLocation}
                                </div>
                                <p style=\"font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;\">Volunteer Notes:</p>
                                <div style=\"background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;\">${updatedRide.specialNote || 'No special notes provided.'}</div>
                            </div>
                        `,
                    };
                    try {
                        await sendEmail(mailOptions);
                        console.log(`Completion email sent for ride ${updatedRide.id} to ${completeRecipients.join(', ')}`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send completion email for ride ${updatedRide.id}:`, emailError);
                    }
                } else {
                    console.warn(`Email not sent for completed ride ${updatedRide.id}: No valid ADMIN/VOLUNTEER recipients found in the database.`);
                }
            }

            const statusMessage = isCompletion 
                ? 'Ride completed successfully!' 
                : isCancellation 
                ? 'Ride cancelled successfully!' 
                : 'Ride updated successfully';

            return NextResponse.json({ 
                message: statusMessage, 
                updatedRide: updatedRide,
                formattedData: finalFormattedData,
            }, { status: 200 });
            
        } else {
            const rideWithUpdatedData = await prisma.ride.findUnique({
                where: { id: parseInt(id, 10) },
                include: {
                    customer: true,
                    addrStart: true,
                    addrEnd: true,
                    volunteer: { include: { user: true } }
                }
            });
            
            const finalFormattedDataForNoUpdate = rideWithUpdatedData ? {
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
                waitTime: (rideWithUpdatedData as any).waitTime !== null ? (rideWithUpdatedData as any).waitTime : 0,
                specialNote: rideWithUpdatedData.specialNote
            } : null;

            return NextResponse.json({ 
                message: 'No ride data to update, but related records may have been updated',
                updatedRide: rideWithUpdatedData,
                formattedData: finalFormattedDataForNoUpdate
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Error updating ride:', error);
        return NextResponse.json({ error: 'Failed to update ride', details: error.message || error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}