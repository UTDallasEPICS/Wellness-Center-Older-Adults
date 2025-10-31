import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail} from '@/util/nodemail';
import { SendMailOptions } from 'nodemailer';

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Get admin email from .env

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
            include: { // Fetch required relations
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

        const { customerID, startAddressID, endAddressID, volunteerID, date, pickupTime, status, driveTimeAB, notes } = updateData;
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
                specialNote: updatedRide.specialNote
            };
            
            if (isCompletion && ADMIN_EMAIL && updatedRide.customer && sendEmail) {
                const mailOptions: SendMailOptions = {
                    to: ADMIN_EMAIL,
                    replyTo: updatedRide.customer.email, 
                    subject: `Ride Completed: ${finalFormattedData.customerName} (ID: ${updatedRide.id})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;">
                            <h2 style="font-size: 24px; color: #0da000; margin-top: 0;">Ride Marked as Complete</h2>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${finalFormattedData.customerName}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Ride ID:</strong> ${updatedRide.id}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Total Drive Time:</strong> ${updatedRide.totalTime}</td></tr>
                                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Completed On:</strong> ${new Date().toLocaleString()}</td></tr>
                            </table>

                            <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
                            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                                <strong>Start:</strong> ${finalFormattedData.startLocation} <br/>
                                <strong>End:</strong> ${finalFormattedData.endLocation}
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
                    console.log(`Email sent for completed ride ${updatedRide.id}`);
                } catch (emailError) {
                    console.error(`ERROR: Failed to send completion email for ride ${updatedRide.id}:`, emailError);
                    return NextResponse.json({ 
                        message: 'Ride updated to Completed, but failed to send admin email notification.', 
                        updatedRide: updatedRide,
                        formattedData: finalFormattedData,
                        emailError: true 
                    }, { status: 200 });
                }
            }

            return NextResponse.json({ 
                message: isCompletion ? 'Ride completed successfully!' : 'Ride updated successfully', 
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