// This file is a Next.js API route that handles a PUT request
// to update the user's information using Prisma.

// Import the Prisma client.
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize the Prisma client.
const prisma = new PrismaClient();

// Handler for the PUT request.
export async function PUT(req) {
  try {
    // Parse the request body to get all the data sent from the frontend.
    const { firstName, lastName, email, phone, username, volunteerStatus } = await req.json();

    // The frontend sends the user's email as 'email'
    // but the backend expects it to be called 'userEmail'.
    // You should use the 'email' variable directly from the payload.
    const userEmail = email;

    // Validate that a user email is present.
    if (!userEmail) {
      await prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ message: "User email is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user exists.
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // If no user is found, return a 404 Not Found error.
    if (!existingUser) {
      await prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ message: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a data object with only the fields that were provided
    // in the request body. This prevents overwriting fields with null or undefined.
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (username) updateData.username = username;
    if (volunteerStatus) updateData.volunteerStatus = volunteerStatus;
    
    // If the request payload is empty, return an error.
    if (Object.keys(updateData).length === 0) {
      await prisma.$disconnect();
      return new NextResponse(
        JSON.stringify({ message: "No valid fields provided for update." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user's information.
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: updateData,
    });

    // Disconnect the Prisma client.
    await prisma.$disconnect();

    // Send a success response with the updated user information.
    return new NextResponse(
      JSON.stringify({
        message: "Account information updated successfully.",
        user: updatedUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user information:", error);
    await prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}