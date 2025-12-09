import nodemailer, { SendMailOptions } from "nodemailer";
import fs from 'fs';
import path from 'path';

// sendEmail supports three modes:
// 1) Real SMTP when EMAIL_HOST/EMAIL_USER/EMAIL_PASS are set.
// 2) Ethereal test account when DEV_USE_ETHEREAL=true (useful for local dev).
// 3) File fallback when EMAIL_WRITE_TO_FILE=true — saves emails to ./sent_emails/ for inspection.

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

async function createTransporter() {
    if (cachedTransporter) return cachedTransporter;

    const useEthereal = process.env.DEV_USE_ETHEREAL === 'true';
    const writeToFile = process.env.EMAIL_WRITE_TO_FILE === 'true';

    if (useEthereal) {
        const testAccount = await nodemailer.createTestAccount();
        cachedTransporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.log('[Email] Using Ethereal test account for sending emails. Preview URLs will be available in logs.');
        return cachedTransporter;
    }

    const host = (process.env.EMAIL_HOST || '').trim();
    const user = (process.env.EMAIL_USER || '').trim();
    const pass = (process.env.EMAIL_PASS || '').trim();

    if (host && user && pass) {
        cachedTransporter = nodemailer.createTransport({
            host,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: { user, pass },
        });
        return cachedTransporter;
    }

    if (writeToFile) {
        // No transporter needed; we'll write emails to disk in sendEmail
        return null as any;
    }

    throw new Error('No SMTP configuration found. Set EMAIL_HOST/EMAIL_USER/EMAIL_PASS, or enable DEV_USE_ETHEREAL or EMAIL_WRITE_TO_FILE.');
}

export async function sendEmail(mailOptions: SendMailOptions): Promise<any> {
    // Determine default sender
    const emailFrom = (process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.EMAIL_USER || '').trim();
    if (!emailFrom && !process.env.EMAIL_WRITE_TO_FILE) {
        throw new Error("MAIL_FROM (or EMAIL_FROM/EMAIL_USER) is not set. Cannot send email.");
    }

    if (!mailOptions.from && emailFrom) mailOptions.from = emailFrom;

    const writeToFile = process.env.EMAIL_WRITE_TO_FILE === 'true';

    if (writeToFile) {
        // Ensure folder exists
        const outDir = path.resolve(process.cwd(), 'sent_emails');
        try { fs.mkdirSync(outDir, { recursive: true }); } catch (e) { /* ignore */ }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = path.join(outDir, `${timestamp}-${(mailOptions.subject || 'email').replace(/[^a-z0-9-_]/gi,'_')}.json`);
        const payload = {
            from: mailOptions.from,
            to: mailOptions.to,
            bcc: mailOptions.bcc,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
            createdAt: new Date().toISOString(),
        };
        fs.writeFileSync(filename, JSON.stringify(payload, null, 2), 'utf8');
        console.log(`[Email] Wrote email to ${filename}`);
        return { savedTo: filename };
    }

    const transporter = await createTransporter();
    try {
        const info = await transporter.sendMail(mailOptions as any);
        console.log('[Email] Sent successfully', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            messageId: info?.messageId,
            accepted: (info as any)?.accepted,
            rejected: (info as any)?.rejected,
            response: (info as any)?.response,
            previewUrl: nodemailer.getTestMessageUrl(info) || undefined,
        });
        if ((info as any)?.rejected && (info as any).rejected.length > 0) {
            console.warn('[Email] Some recipients were rejected:', (info as any).rejected);
        }
        return info;
    } catch (error) {
        console.error("[Email] Error sending email:", error);
        throw error;
    }
}

export default { sendEmail };
