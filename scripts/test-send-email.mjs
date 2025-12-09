import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function main() {
  const host = (process.env.EMAIL_HOST || '').trim();
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();
  const from = (process.env.MAIL_FROM || process.env.EMAIL_FROM || user || '').trim();
  const to = (process.env.TEST_EMAIL || user || '').trim();

  if (!host || !user || !pass || !from || !to) {
    console.error('Missing one of required env vars: EMAIL_HOST, EMAIL_USER, EMAIL_PASS, MAIL_FROM (or EMAIL_FROM), TEST_EMAIL (or EMAIL_USER)');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Test email from Wellness-Center app',
      text: 'This is a test email sent to verify SMTP settings and credentials.',
    });
    console.log('Test email sent. info:', info);
  } catch (err) {
    console.error('Failed to send test email:', err);
    process.exitCode = 2;
  }
}

main();
