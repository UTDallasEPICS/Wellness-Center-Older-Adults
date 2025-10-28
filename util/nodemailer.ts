import { createTransport, SendMailOptions } from "nodemailer";
// Search up App Passwords in the Google account Settings to get to the app and its passwords, but you dont have access to the passwords agail later so you need to use before you get rid of the pop-up boxes.
// Everyone needs to do: npm install nodemailer
// Initialize the Nodemailer Transporter
// Connects to the Gmail SMTP server using your .env variables.
const transporter = createTransport({
  host: process.env.EMAIL_HOST, // "smtp.gmail.com"
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, // djanjanam@gmail.com
    pass: process.env.EMAIL_PASS, // rzynrgqwgzgbcbgm
  },
});


// This block of code sends a general email using the configured SMTP transporter.

// This line sends the actual email.
export async function sendEmail(mailOptions: SendMailOptions): Promise<void> {
  // This is the defualt sender address.
  const emailFrom = process.env.EMAIL_FROM;
  // Checks if the sender address is actually filled out in the .env file.
  if (!emailFrom) {
      throw new Error("EMAIL_FROM environment variable is not set. Cannot send email.");
  }
  
  try {
    // This is the line that sends the actual email.
    const info = await transporter.sendMail(mailOptions);
    // log statement if the email is sent successfully
    console.log(`Email sent successfully to ${mailOptions.to}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Log statement if the email is not sent successfully.
    throw new Error("Failed to send email due to an SMTP error.");
  }
}