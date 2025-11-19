import { NextResponse, NextRequest } from 'next/server';
// Removed UserRole import as it's not defined as an enum in your schema
import { PrismaClient } from '@prisma/client'; 
import { sendEmail } from '@/util/nodemail';
import { SendMailOptions } from 'nodemailer';

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const VOLUNTEER_EMAIL = process.env.VOLUNTEER_EMAIL

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

// Updated filtering logic to use isAdmin and role String field
async function getAllRecipientEmails(): Promise<string[]> {
    const adminEmails = (
        await prisma.user.findMany({
            where: {
                role: 'ADMIN',
                isAdmin: true,
            },
            select: { email: true }
        })
    ).map(u => u.email).filter((email): email is string => !!email);

    const volunteerEmails = (
        await prisma.user.findMany({
            where: {
                role: 'VOLUNTEER',
                isAdmin: false,
            },
            select: { email: true }
        })
    ).map(u => u.email).filter((email): email is string => !!email);

    const envEmails = [ADMIN_EMAIL, VOLUNTEER_EMAIL].filter((email): email is string => !!email);

    const recipients = new Set([...adminEmails, ...volunteerEmails, ...envEmails]);

    return Array.from(recipients);
}

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
        
        const pickupTimeFormatted = ride.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

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
            pickupTime: pickupTimeFormatted,
            driveTimeAB: ride.totalTime || '',
            totalTime: ride.totalTime || '',
            waitTime: typeof ride.waitTime === 'number' ? ride.waitTime : 0,
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

    try {
        const updateData = await request.json();

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
        
        const isReserving = ride.status !== "Reserved" && updateData.status === "Reserved" && updateData.volunteerID;
        const isCompletion = updateData.status === 'Completed';
        const isCancellation = updateData.status === 'Cancelled';
        
        let NEWLY_ASSIGNED_VOLUNTEER_EMAIL = null;
        
        if (isReserving && updateData.volunteerID) {
            // FIX: Changed prisma.volunteer to prisma.volunteerInfo
            const newVolunteer = await prisma.volunteerInfo.findUnique({
                where: { id: parseInt(updateData.volunteerID as string, 10) },
                include: { user: true }
            });
            if (newVolunteer?.user?.email) {
                NEWLY_ASSIGNED_VOLUNTEER_EMAIL = newVolunteer.user.email;
            }
        }
        
        if (isCompletion) {
            if (!updateData.driveTimeAB) {
                return NextResponse.json(
                    { error: 'Cannot complete ride. Total drive time is required.' },
                    { status: 400 }
                );
            }
        }

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

        if (updateData.customerUpdates?.id) {
            await prisma.customer.update({
                where: { id: parseInt(updateData.customerUpdates.id, 10) },
                data: {
                    firstName: updateData.customerUpdates.firstName,
                    lastName: updateData.customerUpdates.lastName,
                    customerPhone: updateData.customerUpdates.customerPhone,
                },
            });
        }

        if (updateData.addressUpdates?.id) {
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

        const { 
            customerID, 
            startAddressID, 
            endAddressID, 
            volunteerID, 
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
        if (volunteerID !== undefined) prismaUpdateData.volunteer = volunteerID === null ? { disconnect: true } : { connect: { id: parseInt(volunteerID as string, 10) } };

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

            const dateString = new Date(updatedRide.date).toLocaleDateString();
            const timeString = updatedRide.pickupTime ? updatedRide.pickupTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';

            finalFormattedData = {
                id: updatedRide.id,
                customerID: updatedRide.customerID,
                customerName: updatedRide.customer ? `${updatedRide.customer.firstName} ${updatedRide.customer.lastName}` : '',
                customerPhone: updatedRide.customer?.customerPhone || '',
                startAddressID: updatedRide.startAddressID,
                // FIX: Changed updatedRide.addressID to updatedRide.endAddressID
                endAddressID: updatedRide.endAddressID, 
                startLocation: updatedRide.addrStart ? `${updatedRide.addrStart.street}, ${updatedRide.addrStart.city}, ${updatedRide.addrStart.state} ${updatedRide.addrStart.postalCode}` : '',
                endLocation: updatedRide.addrEnd ? `${updatedRide.addrEnd.street}, ${updatedRide.addrEnd.city}, ${updatedRide.addrEnd.state} ${updatedRide.addrEnd.postalCode}` : '',
                date: updatedRide.date,
                startTime: timeString,
                status: updatedRide.status,
                totalTime: updatedRide.totalTime,
                waitTime: updatedRide.waitTime !== null ? updatedRide.waitTime : 0,
                specialNote: updatedRide.specialNote
            };
            
            const allRecipients = await getAllRecipientEmails();
            
            if (isCancellation && updatedRide.customer && sendEmail && allRecipients.length > 0) {
                const mailOptions: SendMailOptions = {
                    to: allRecipients, 
                    subject: `RIDE CANCELLED: ${finalFormattedData.customerName} on ${dateString}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cc0000;">
                            <h2 style="font-size: 24px; color: #cc0000; margin-top: 0;">Ride Has Been Cancelled</h2>
                            <p>The following ride has been marked as **CANCELLED**.</p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${dateString}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Time:</strong> ${finalFormattedData.startTime}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Status:</strong> <span style="color: #cc0000; font-weight: bold;">CANCELLED</span></td></tr>
                            </table>

                            <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
                            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                                <strong>Pickup:</strong> ${finalFormattedData.startLocation} <br/>
                                <strong>Dropoff:</strong> ${finalFormattedData.endLocation}
                            </div>
                            
                            ${updatedRide.specialNote ? `<p style="font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;">Notes:</p>
                            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;">
                                ${updatedRide.specialNote}
                            </div>` : ''}
                        </div>
                    `,
                };

                try {
                    await sendEmail(mailOptions);
                    console.log(`Email sent for cancelled ride ${updatedRide.id} to ${allRecipients.join(', ')}`);
                } catch (emailError) {
                    console.error(`ERROR: Failed to send cancellation email for ride ${updatedRide.id}:`, emailError);
                }
            } else if (isCancellation) {
                console.warn(`Cancellation email not sent for ride ${updatedRide.id}: No valid recipients found or sendEmail is unavailable.`);
            }

            if (isCompletion && updatedRide.customer && sendEmail && allRecipients.length > 0) {
                
                const mailOptions: SendMailOptions = {
                    to: allRecipients, 
                    subject: `Ride Completed: #${updatedRide.id} - ${finalFormattedData.customerName}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;">
                            <h2 style="font-size: 24px; color: #0da000; margin-top: 0;">Ride Marked as Complete</h2>
                            <p>The following ride has been marked as **COMPLETED**.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${dateString}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Time:</strong> ${finalFormattedData.startTime}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Total Drive Time:</strong> ${updatedRide.totalTime || 'N/A'}</td></tr>
                                ${updatedRide.waitTime && updatedRide.waitTime > 0 ? `<tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Wait Time:</strong> ${updatedRide.waitTime} hours</td></tr>` : ''}
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Completed On:</strong> ${new Date().toLocaleString()}</td></tr>
                            </table>

                            <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
                            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                                <strong>Pickup:</strong> ${finalFormattedData.startLocation} <br/>
                                <strong>Dropoff:</strong> ${finalFormattedData.endLocation}
                            </div>
                            
                            <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;">Volunteer Notes:</p>
                            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;">
                                ${updatedRide.specialNote || 'No special notes provided.'}
                            </div>
                        </div>
                    `,
                };
                try {
                    await sendEmail(mailOptions);
                    console.log(`Completion email sent for ride ${updatedRide.id} to ${allRecipients.join(', ')}`);
                } catch (emailError) {
                    console.error(`ERROR: Failed to send completion email for ride ${updatedRide.id}:`, emailError);
                }
            } else if (isCompletion) {
                console.warn(`Completion email not sent for ride ${updatedRide.id}: No valid recipients found or sendEmail is unavailable.`);
            }
            
            if (isReserving && updatedRide.customer && updatedRide.volunteer?.user && sendEmail) {
                if (ADMIN_EMAIL) {
                    const adminMailOptions: SendMailOptions = {
                        to: ADMIN_EMAIL, 
                        subject: `Ride Reserved: #${updatedRide.id} - ${finalFormattedData.customerName}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981;">
                                <h2 style="font-size: 24px; color: #10b981; margin-top: 0;">Ride Reserved Notification</h2>
                                <p>Ride <strong>#${updatedRide.id}</strong> has been reserved by <strong>${updatedRide.volunteer.user.firstName} ${updatedRide.volunteer.user.lastName}</strong>.</p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${dateString}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Time:</strong> ${timeString}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Status:</strong> <span style="color: #10b981; font-weight: bold;">RESERVED</span></td></tr>
                                </table>

                                <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
                                <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                                    <strong>Pickup:</strong> ${finalFormattedData.startLocation} <br/>
                                    <strong>Dropoff:</strong> ${finalFormattedData.endLocation}
                                </div>
                            </div>
                        `,
                    };
                    try {
                        await sendEmail(adminMailOptions);
                        console.log(`Admin email sent for reserved ride ${updatedRide.id}.`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send admin reservation email for ride ${updatedRide.id}:`, emailError);
                    }
                }
                
                if (NEWLY_ASSIGNED_VOLUNTEER_EMAIL) {
                    const volunteerMailOptions: SendMailOptions = {
                        to: NEWLY_ASSIGNED_VOLUNTEER_EMAIL, 
                        subject: `Ride Confirmation: Ride #${updatedRide.id} Reserved`,
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
                        await sendEmail(volunteerMailOptions);
                        console.log(`Volunteer email sent for reserved ride ${updatedRide.id} to ${NEWLY_ASSIGNED_VOLUNTEER_EMAIL}.`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send volunteer reservation email for ride ${updatedRide.id}:`, emailError);
                    }
                } else if (isReserving) {
                    console.warn(`Volunteer reservation email not sent for ride ${updatedRide.id}: Volunteer email not found.`);
                }
            } else if (isReserving) {
                console.warn(`Reservation email not sent for ride ${updatedRide.id}: Volunteer, customer data, or sendEmail is unavailable.`);
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
                waitTime: rideWithUpdatedData.waitTime !== null ? rideWithUpdatedData.waitTime : 0,
                specialNote: rideWithUpdatedData.specialNote
            } : null;

            return NextResponse.json({ 
                message: 'No direct ride fields updated, but related records may have been updated',
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