import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/util/nodemail';
import { SendMailOptions } from 'nodemailer';
import { cookies } from 'next/headers';
import { jwtVerify, importX509 } from 'jose';

const prisma = new PrismaClient();

interface RideRequestBody {
  customerId: number;
  pickupStreet: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  destinationStreet: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  pickUpTime: string;
  date: string;
  waitTime?: number;
  extraInfo: string;
}

// Helper function to get current user info from JWT token
async function getCurrentUserInfo(): Promise<{ email: string; role: string; volunteerID: number | null } | null> {
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
    
    const userEmail = decoded.payload.email as string;
    if (!userEmail) return null;

    // Get user with their role and volunteer info
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        volunteer: true,
      },
    });

    if (!user) return null;

    return {
      email: userEmail,
      role: user.role,
      volunteerID: user.volunteer?.id || null,
    };
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return null;
  }
}

// POST - Create a new ride
export async function POST(req: Request) {
  try {
    const {
      customerId,
      pickupStreet,
      pickupCity,
      pickupState,
      pickupZip,
      destinationStreet,
      destinationCity,
      destinationState,
      destinationZip,
      pickUpTime,
      date,
      waitTime,
      extraInfo,
    } = (await req.json()) as RideRequestBody;

    // Find the Customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { status: 400, message: 'Customer not found' },
        { status: 400 }
      );
    }

    const pickupDateTime = new Date(date);
    const [hours, minutes] = pickUpTime.split(':').map(Number);
    pickupDateTime.setHours(hours, minutes, 0, 0);

    // Use a transaction to ensure atomicity
    const createdRide = await prisma.$transaction(async (tx) => {
      // Check if pickup address exists
      let startAddress = await tx.address.findFirst({
        where: {
          street: pickupStreet,
          city: pickupCity,
          state: pickupState,
          postalCode: pickupZip,
        },
      });

      if (!startAddress) {
        startAddress = await tx.address.create({
          data: {
            street: pickupStreet,
            city: pickupCity,
            state: pickupState,
            postalCode: pickupZip,
          },
        });
      }

      // Check if destination address exists
      let endAddress = await tx.address.findFirst({
        where: {
          street: destinationStreet,
          city: destinationCity,
          state: destinationState,
          postalCode: destinationZip,
        },
      });

      if (!endAddress) {
        endAddress = await tx.address.create({
          data: {
            street: destinationStreet,
            city: destinationCity,
            state: destinationState,
            postalCode: destinationZip,
          },
        });
      }

      // Create the Ride record
      const ride = await tx.ride.create({
        data: {
          customerID: customer.id,
          date: pickupDateTime,
          pickupTime: pickupDateTime,
          startAddressID: startAddress.id,
          endAddressID: endAddress.id,
          specialNote: extraInfo,
          waitTime: waitTime !== undefined && waitTime !== null ? Number(waitTime) : 0,
          volunteerID: null,
          status: 'AVAILABLE',
        },
        include: {
          customer: true,
          addrStart: true,
          addrEnd: true,
        },
      });
      return ride;
    });

    // Format the response to match what the frontend expects
    const formattedRide = {
      id: createdRide.id,
      customerID: createdRide.customerID,
      customerName: createdRide.customer ? `${createdRide.customer.firstName} ${createdRide.customer.lastName}` : '',
      customerPhone: createdRide.customer?.customerPhone || '',
      phoneNumber: createdRide.customer?.customerPhone || '',
      startAddressID: createdRide.startAddressID,
      endAddressID: createdRide.endAddressID,
      startLocation: createdRide.addrStart ? `${createdRide.addrStart.street}, ${createdRide.addrStart.city}, ${createdRide.addrStart.state} ${createdRide.addrStart.postalCode}` : '',
      startAddress: createdRide.addrStart ? `${createdRide.addrStart.street}, ${createdRide.addrStart.city}, ${createdRide.addrStart.state} ${createdRide.addrStart.postalCode}` : '',
      endLocation: createdRide.addrEnd ? `${createdRide.addrEnd.street}, ${createdRide.addrEnd.city}, ${createdRide.addrEnd.state} ${createdRide.addrEnd.postalCode}` : '',
      date: createdRide.date.toISOString(),
      startTime: createdRide.pickupTime.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      waitTime: createdRide.waitTime !== null ? createdRide.waitTime : 0,
      status: createdRide.status,
      specialNote: createdRide.specialNote,
    };

    // Send email to all available volunteers
    try {
      // Fetch all available volunteers
      const availableVolunteers = await prisma.volunteerInfo.findMany({
        where: {
          status: 'AVAILABLE',
        },
        include: {
          user: true,
        },
      });

      // Extract email addresses
      const volunteerEmails = availableVolunteers
        .map(volunteer => volunteer.user.email)
        .filter((email): email is string => !!email);

      if (volunteerEmails.length > 0 && sendEmail) {
        const mailOptions: SendMailOptions = {
          to: volunteerEmails,
          subject: `New Ride Available: ${formattedRide.customerName}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0da000;">
              <h2 style="font-size: 24px; color: #0da000; margin-top: 0;">New Ride Available</h2>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Client:</strong> ${formattedRide.customerName}</td></tr>
                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Phone:</strong> ${formattedRide.customerPhone}</td></tr>
                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Date:</strong> ${new Date(createdRide.date).toLocaleDateString()}</td></tr>
                <tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Pickup Time:</strong> ${formattedRide.startTime}</td></tr>
                ${formattedRide.waitTime ? `<tr><td style="padding: 5px 0;"><strong style="color: #4a5568;">Wait Time:</strong> ${formattedRide.waitTime} hours</td></tr>` : ''}
              </table>

              <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Ride Route:</p>
              <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 14px; color: #4a5568;">
                <strong>Pickup:</strong> ${formattedRide.startLocation} <br/>
                <strong>Dropoff:</strong> ${formattedRide.endLocation}
              </div>
              
              ${formattedRide.specialNote ? `
                <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c; margin-top: 20px;">Special Notes:</p>
                <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; color: #4a5568;">
                  ${formattedRide.specialNote}
                </div>
              ` : ''}
              
              <p style="margin-top: 20px; color: #4a5568;">Please log in to the dashboard to claim this ride if you're available.</p>
            </div>
          `,
        };

        await sendEmail(mailOptions);
        console.log(`New ride notification sent to ${volunteerEmails.length} available volunteers`);
      } else {
        console.warn('No available volunteers found to notify about new ride or sendEmail not available');
      }
    } catch (emailError) {
      // Log the error but don't fail the ride creation
      console.error('Failed to send email notifications to volunteers:', emailError);
      // The ride was still created successfully, so we continue
    }

    return NextResponse.json(
      { status: 201, message: 'Ride created successfully', data: formattedRide },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ride:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to create ride due to a database error',
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Fetch rides with role-based filtering
export async function GET(req: Request) {
  try {
    // Get current user info (email, role, volunteerID)
    const userInfo = await getCurrentUserInfo();
    
    if (!userInfo) {
      return NextResponse.json(
        { error: 'Unauthorized - no valid session found' },
        { status: 401 }
      );
    }

    const { role, volunteerID } = userInfo;

    let whereClause: any = {};

    // Role-based filtering
    if (role === 'ADMIN') {
      // Admins see all rides (no filter needed)
      whereClause = {};
    } else if (role === 'VOLUNTEER') {
      // Volunteers see:
      // 1. All unreserved rides (AVAILABLE, Added, Unreserved)
      // 2. Only their own reserved rides
      // 3. Only their own completed rides
      
      if (!volunteerID) {
        // If somehow a volunteer has no volunteerID, return empty array
        return NextResponse.json([]);
      }

      whereClause = {
        OR: [
          // Unreserved rides (any volunteer can see)
          {
            status: {
              in: ['AVAILABLE', 'Added', 'Unreserved']
            },
          },
          // Reserved rides assigned to this volunteer
          {
            status: 'Reserved',
            volunteerID: volunteerID,
          },
          // Completed rides assigned to this volunteer
          {
            status: 'Completed',
            volunteerID: volunteerID,
          },
        ],
      };
    } else {
      // Unknown role - return empty array
      return NextResponse.json([]);
    }

    // Fetch rides with the appropriate filter
    const rides = await prisma.ride.findMany({
      where: whereClause,
      include: {
        customer: true,
        addrStart: true,
        addrEnd: true,
        volunteer: {
          include: {
            user: true,
          },
        },
      },
    });

    // Format rides to match what the components expect
    const formattedRides = rides.map(ride => {
      // Extract just the time portion from pickupTime DateTime
      const pickupDate = new Date(ride.pickupTime);
      const hours = pickupDate.getHours().toString().padStart(2, '0');
      const minutes = pickupDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      return {
        id: ride.id,
        
        // ID constants
        customerID: ride.customerID,
        startAddressID: ride.startAddressID,
        endAddressID: ride.endAddressID,
        volunteerID: ride.volunteerID,
        
        // Customer data
        customerName: ride.customer 
          ? `${ride.customer.firstName} ${ride.customer.lastName}` 
          : '',
        customerPhone: ride.customer?.customerPhone || '',
        phoneNumber: ride.customer?.customerPhone || '',
        
        // Address data
        startAddress: ride.addrStart 
          ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` 
          : '',
        startLocation: ride.addrStart 
          ? `${ride.addrStart.street}, ${ride.addrStart.city}, ${ride.addrStart.state} ${ride.addrStart.postalCode}` 
          : '',
        endAddress: ride.addrEnd 
          ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` 
          : '',
        endLocation: ride.addrEnd 
          ? `${ride.addrEnd.street}, ${ride.addrEnd.city}, ${ride.addrEnd.state} ${ride.addrEnd.postalCode}` 
          : '',
        
        // Volunteer data
        volunteerName: ride.volunteer?.user 
          ? `${ride.volunteer.user.firstName} ${ride.volunteer.user.lastName}` 
          : '',
        
        // Date/Time data
        date: ride.date.toISOString(),
        startTime: timeString,
        
        // Status and other fields
        status: ride.status,
        totalTime: ride.totalTime || '',
        waitTime: typeof ride.waitTime === 'number' ? ride.waitTime : 0,
        specialNote: ride.specialNote || '',
      };
    });

    return NextResponse.json(formattedRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rides' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}