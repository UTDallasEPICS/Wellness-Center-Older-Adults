import { NextResponse } from 'next/server';
import { sendEmail } from '@/util/nodemail';
import { SendMailOptions } from "nodemailer";

// Data expected from the frontend form
interface ContactFormData {
    name: string;
    email: string; // Required for replyTo and content
    message: string;
}

// Make sure that the recipient is in your .env file
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * Handles POST requests to the /api/email endpoint for the Next.js App Router.
 * @param request The Next.js Request object.
 */

export async function POST(request: Request) {

    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set.");
        return NextResponse.json({ error: 'Server configuration error: ADMIN_EMAIL missing.' }, { status: 500 });
    }


    let body: ContactFormData;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON format or missing request body.' }, { status: 400 });
    }

    // FIX: Destructure email from the body
    const { name, email, message } = body;

    // FIX: Add email to the required field validation check
    if (!name || !email || !message) {
        return NextResponse.json(
            { error: 'Missing required fields: name, email, and message are required.' },
            { status: 400 }
        );
    }

    // 3. Prepare Email Options
    const mailOptions: SendMailOptions = {
        to: ADMIN_EMAIL,
        replyTo: email, // Optional: Use this to make replying easy in your inbox
        subject: `Wellness Center For Older Adults from ${name}`,

        // Plain text version
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,

        // The actual email
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee;">
                <h2 style="font-size: 24px; color: #1a202c; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #419902; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                    <tr>
                        <td style="padding: 5px 0;">
                            <strong style="color: #4a5568;">Name:</strong> ${name}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;">
                            <strong style="color: #4a5568;">Email:</strong>
                            <a href="mailto:${email}" style="color: #419902; text-decoration: none;">${email}</a>
                        </td>
                    </tr>
                </table>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

                <p style="font-weight: bold; margin-bottom: 8px; color: #1a202c;">Message:</p>
                <div style="
                    background-color: #f7fafc;
                    padding: 15px;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                    white-space: pre-wrap;
                    font-size: 14px;
                    color: #4a5568;
                ">
                    ${message}
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #718096;">
                    This message was sent automatically from the contact form at your website.
                </p>
            </div>
        `,
    };

    // Send the Email
    try {
        await sendEmail(mailOptions);

        // Success response (Status 200)
        return NextResponse.json(
            { success: true, message: 'Message sent successfully!' },
            { status: 200 }
        );

    } catch (error) {
        console.error("Email failed to send:", error);
        // Failure response from SMTP error
        return NextResponse.json(
            { error: 'Failed to send message due to a server error. Please check server logs.' },
            { status: 500 }
        );
    }
}
