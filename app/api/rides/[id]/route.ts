import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/util/nodemail';
import { SendMailOptions } from 'nodemailer';

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const VOLUNTEER_EMAIL = process.env.VOLUNTEER_EMAIL;

// Function to fetch all Admin and Volunteer emails dynamically from the database
async function getAllRecipientEmails() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { role: 'ADMIN' },
                { role: 'VOLUNTEER' }
            ],
            isArchived: false,
        },
        select: {
            email: true,
        },
    });

    const emails = users.map(user => user.email).filter((email): email is string => !!email);
    
    // Add environment variables as a fallback and deduplicate
    const uniqueEmails = Array.from(new Set([
        ...emails,
        ADMIN_EMAIL,
        VOLUNTEER_EMAIL
    ].filter((email): email is string => !!email))); 

    return uniqueEmails;
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

    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set.");
    }

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

        const isCompletion = updateData.status === 'Completed';
        const isCancellation = updateData.status === 'Cancelled'; // Determine cancellation status here

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
                waitTime: updatedRide.waitTime !== null ? updatedRide.waitTime : 0,
                specialNote: updatedRide.specialNote
            };
            
            // --- CANCELLATION EMAIL LOGIC START (Now using getAllRecipientEmails) ---
            if (isCancellation && updatedRide.customer && sendEmail) {
                
                // Get ALL Admin and Volunteer emails from the database + environment variables
                const recipients = await getAllRecipientEmails();

                if (recipients.length > 0) {
                    const mailOptions: SendMailOptions = {
                        to: recipients,
                        subject: `RIDE CANCELLED: ${finalFormattedData.customerName} on ${new Date(updatedRide.date).toLocaleDateString()}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cc0000;">
                                <h2 style="font-size: 24px; color: #cc0000; margin-top: 0;">Ride Has Been Cancelled</h2>
                                <p>The following ride has been marked as **CANCELLED**.</p>

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
                                
                                ${updatedRide.specialNote ? `<p style="font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;">Notes:</p>
                                <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;">
                                    ${updatedRide.specialNote}
                                </div>` : ''}
                            </div>
                        `,
                    };

                    try {
                        await sendEmail(mailOptions);
                        console.log(`Email sent for cancelled ride ${updatedRide.id} to ${recipients.join(', ')}`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send cancellation email for ride ${updatedRide.id}:`, emailError);
                    }
                } else {
                    console.warn(`Cancellation email not sent for ride ${updatedRide.id}: No valid ADMIN/VOLUNTEER recipients found.`);
                }
            }
            // --- CANCELLATION EMAIL LOGIC END ---
            
            // Existing Completion Logic
            if (isCompletion && ADMIN_EMAIL && updatedRide.customer && sendEmail) {
                
                // Get ALL Admin and Volunteer emails from the database + environment variables
                const recipients = await getAllRecipientEmails();

                if (recipients.length > 0) {
                    const mailOptions: SendMailOptions = {
                        to: recipients, 
                        subject: `Ride Completed: ${finalFormattedData.customerName}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;">
                                <h2 style="font-size: 24px; color: #0da000; margin-top: 0;">Ride Marked as Complete</h2>

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                    <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Total Drive Time:</strong> ${updatedRide.totalTime}</td></tr>
                                    ${updatedRide.waitTime ? `<tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Wait Time:</strong> ${updatedRide.waitTime} hours</td></tr>` : ''}
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
                        console.log(`Email sent for completed ride ${updatedRide.id} to ${recipients.join(', ')}`);
                    } catch (emailError) {
                        console.error(`ERROR: Failed to send completion email for ride ${updatedRide.id}:`, emailError);
                        return NextResponse.json({ 
                            message: 'Ride updated to Completed, but failed to send admin email notification.', 
                            updatedRide: updatedRide,
                            formattedData: finalFormattedData,
                            emailError: true 
                        }, { status: 200 });
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
                waitTime: rideWithUpdatedData.waitTime !== null ? rideWithUpdatedData.waitTime : 0,
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