import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EditVolunteerParams {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return Response.json({
      status: 405,
      message: 'Method Not Allowed',
    });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    console.error('Failed to parse request body as JSON:', error);
    return Response.json({
      status: 400,
      message: 'Invalid JSON body in request',
    });
  }
  
  try {
    const { id, firstName, lastName, email, phone } = requestBody as EditVolunteerParams;

    const volunteerId = Number(id);
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    const mail = (email || '').trim();
    const phoneRaw = (phone || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isNaN(volunteerId) || !first || !last || !mail || !phoneRaw) {
      return Response.json({
        status: 400,
        message: 'Missing or invalid required fields',
      });
    }
    if (!nameRe.test(first)) {
      return Response.json({ status: 400, message: 'Invalid first name.' });
    }
    if (!nameRe.test(last)) {
      return Response.json({ status: 400, message: 'Invalid last name.' });
    }
    if (!emailRe.test(mail) || mail.length > 254) {
      return Response.json({ status: 400, message: 'Invalid email address.' });
    }
    if (phoneDigits.length !== 10) {
      return Response.json({ status: 400, message: 'Invalid phone number. Use exactly 10 digits.' });
    }

    const existingVolunteer = await prisma.volunteerInfo.findUnique({
      where: { id: volunteerId },
      select: { userID: true },
    });

    if (!existingVolunteer) {
      return Response.json({
        status: 404,
        message: 'Volunteer not found',
      });
    }

    // Ensure email/phone uniqueness excluding this user
    const currentUserId = existingVolunteer.userID;
    const emailConflict = await prisma.user.findFirst({
      where: { email: mail, NOT: { id: currentUserId } },
      select: { id: true },
    });
    if (emailConflict) {
      return Response.json({
        status: 400,
        message: 'Email already in use by another user',
      });
    }

    const phoneConflict = phoneRaw
      ? await prisma.user.findFirst({ where: { phone: phoneRaw, NOT: { id: currentUserId } }, select: { id: true } })
      : null;
    if (phoneConflict) {
      return Response.json({
        status: 400,
        message: 'Phone number already in use by another user',
      });
    }

    // Update the related user record
    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: { firstName: first, lastName: last, email: mail, phone: phoneRaw },
    });

    return Response.json({
      status: 200,
      message: 'Volunteer updated successfully',
      volunteer: {
        id: volunteerId,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone ?? '',
      },
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect();
  }
}