
import { sendEmail } from '../../../../../util/nodemail';
import { SendMailOptions } from "nodemailer";

// Define the shape of the data expected from the frontend form
interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

// Ensure the recipient is available (set in your .env file)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * Handles POST requests to the /api/email endpoint.
 * This function is designed to be used as an Express route handler:
 * app.post('/api/email', handleContactEmail);
 * @param req The Express request object.
 * @param res The Express response object.
 */
export async function handleContactEmail(req: any, res: any) {

    // 1. Server Configuration Check
    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set.");
        // Use Express response method: res.status().json()
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    // 2. Parse and Validate Request Body
    // Express middleware (e.g., express.json()) parses the JSON body into req.body
    const body: ContactFormData = req.body;
    
    // Check if the body was successfully parsed (e.g., valid JSON was sent)
    if (!body) {
        return res.status(400).json({ error: 'Missing request body or invalid content type.' });
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
        // Use Express response method: res.status().json()
        return res.status(400).json(
            { error: 'Missing required fields: name, email, and message are required.' }
        );
    }

    // 3. Prepare Email Options
    const mailOptions: SendMailOptions = {
        to: ADMIN_EMAIL, 
        replyTo: email, // Allows the admin to hit 'Reply' and send an email back to the user
        subject: `[WELLNESS CENTER] Contact from ${name}`,
        
        // Plain text version (good practice for compatibility)
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        
        // HTML version for formatting
        html: `
            <div style="font-family: sans-serif;">
                <h2>New Message from Contact Form</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; padding: 10px; border: 1px solid #ccc;">${message}</p>
            </div>
        `,
    };

    // 4. Send the Email
    try {
        await sendEmail(mailOptions);
        
        // Success response (Status 200)
        // Use Express response method: res.status().json()
        return res.status(200).json(
            { success: true, message: 'Message sent successfully!' }
        );

    } catch (error) {
        console.error("Email failed to send:", error); 
        // Failure response from SMTP error
        // Use Express response method: res.status().json()
        return res.status(500).json(
            { error: 'Failed to send message due to a server error. Please check server logs.' }
        );
    }
}