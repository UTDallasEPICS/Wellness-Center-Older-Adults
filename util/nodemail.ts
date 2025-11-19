import { createTransport, SendMailOptions } from "nodemailer";

// Search up App Passwords in the Google account Settings to get to the app and its passwords, but you dont have access to the passwords agail later so you need to use before you get rid of the pop-up boxes.
// Everyone needs to do: npm install nodemailer
// Initialize the Nodemailer Transporter
// Connects to the Gmail SMTP server using your .env variables.
const host = (process.env.EMAIL_HOST || '').trim();
const user = (process.env.EMAIL_USER || '').trim();
const pass = (process.env.EMAIL_PASS || '').trim();

const transporter = createTransport({
    host, // e.g. "smtp.gmail.com"
    port: 587,
    secure: false,
    auth: {
        user,
        pass,
    },
});


// This block of code sends a general email using the configured SMTP transporter.

// This line sends the actual email.
export async function sendEmail(mailOptions: SendMailOptions): Promise<void> {
    // This is the default sender address.
    // Prefer MAIL_FROM; fallback to EMAIL_FROM or EMAIL_USER; trim whitespace
    const emailFrom = (process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.EMAIL_USER || '').trim();
    // Checks if the sender address is actually filled out in the .env file.
    if (!emailFrom) {
        throw new Error("MAIL_FROM (or EMAIL_FROM/EMAIL_USER) is not set. Cannot send email.");
    }
    
    // Add the sender to the mail options if it's missing (Nodemailer requires a 'from' address)
    if (!mailOptions.from) {
        mailOptions.from = emailFrom;
    }

    try {
        // This is the line that sends the actual email.
        const info = await transporter.sendMail(mailOptions);
        // Log success details for debugging/verification in the server console
        console.log('[Email] Sent successfully', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            messageId: info?.messageId,
            accepted: (info as any)?.accepted,
            rejected: (info as any)?.rejected,
            response: (info as any)?.response,
        });
        if ((info as any)?.rejected && (info as any).rejected.length > 0) {
            console.warn('[Email] Some recipients were rejected:', (info as any).rejected);
        }
    } catch (error) {
        console.error("[Email] Error sending email:", error);
        // Log statement if the email is not sent successfully.
        throw new Error("Failed to send email due to an SMTP error.");
    }
}
