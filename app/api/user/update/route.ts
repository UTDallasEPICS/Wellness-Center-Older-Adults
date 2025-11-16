import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

 

export async function PUT(req) {
  try {
    const { firstName, lastName, email, phone, status } = await req.json();
    const userEmail = email;

    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ message: "User email is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user and include their volunteer info
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        volunteer: true, // This is key to accessing the volunteer info
      },
    });

    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userData = {};
    if (firstName) userData.firstName = firstName;
    if (lastName) userData.lastName = lastName;
    if (phone) userData.phone = phone;
  

    let updatedUser = null;
    if (Object.keys(userData).length > 0) {
      updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: userData,
        include: {
          volunteer: true, // Also include volunteer data in the response
        },
      });
    }

    // Check if a 'status' was provided and update the VolunteerInfo model
    let updatedVolunteer = null;
    if (status) {
      updatedVolunteer = await prisma.volunteerInfo.update({
        where: { userID: existingUser.id },
        data: {
          status: status,
        },
      });
    }

    // Prepare the final response object.
    // Use the updated user data if available, otherwise use the existing user.
    // Combine with the updated volunteer info if it was updated.
    const finalUser = updatedUser ? updatedUser : existingUser;
    
    // Replace the old volunteer info with the updated one if it exists
    if (updatedVolunteer) {
      finalUser.volunteer = updatedVolunteer;
    }

    return new NextResponse(
      JSON.stringify({
        message: "Account information updated successfully.",
        user: finalUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user information:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}