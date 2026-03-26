import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// In-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function getAllowedOrigin(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || req.nextUrl.origin;
}

function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;

  const allowedOrigins = [
    'https://intercessor.uk',
    'https://www.intercessor.uk',
    'http://localhost:3000'
  ];

  if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const envOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/['"]/g, '');
    if (envOrigin && new URL(origin).origin === new URL(envOrigin).origin) {
      return true;
    }
  } catch {}

  return false;
}

function getMissingSmtpConfig(): string[] {
  const required: Array<[string, string | undefined]> = [
    ['SMTP_HOST', process.env.SMTP_HOST],
    ['SMTP_PORT', process.env.SMTP_PORT],
    ['SMTP_USER', process.env.SMTP_USER],
    ['SMTP_PASS', process.env.SMTP_PASS],
  ];

  return required.filter(([, value]) => !value).map(([name]) => name);
}

function getContactRecipient(): string {
  return process.env.CONTACT_EMAIL_TO?.trim() || 'contact@intercessor.uk';
}

function toValidatedString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;

  return normalized;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(req: NextRequest) {
  try {
    if (!isOriginAllowed(req)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    // Rate limiting: 5 requests per hour per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    const now = Date.now();
    const hour = 3600000;

    const rateLimitKey = ip;
    const current = rateLimitStore.get(rateLimitKey);

    if (current && now < current.resetTime) {
      current.count++;
      if (current.count > 5) {
        console.warn(`[Rate Limit] IP ${ip} exceeded limit`);
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + hour });
    }

    const payload = (await req.json()) as Record<string, unknown>;
    const name = toValidatedString(payload.name, MAX_NAME_LENGTH);
    const email = toValidatedString(payload.email, 254);
    const subject = toValidatedString(payload.subject, MAX_SUBJECT_LENGTH);
    const message = toValidatedString(payload.message, MAX_MESSAGE_LENGTH);

    if (!name || !email || !subject || !message) {
      console.warn(`[Contact Form] Missing required fields from IP ${ip}`);
      return NextResponse.json(
        { error: 'Please provide valid name, email, subject, and message.' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      console.warn(`[Contact Form] Invalid email format: ${email}`);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const missingSmtpConfig = getMissingSmtpConfig();
    if (missingSmtpConfig.length > 0) {
      console.error('[Contact Form] Missing SMTP configuration', { missingSmtpConfig });
      return NextResponse.json(
        { success: false, error: 'Email service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const contactRecipient = getContactRecipient();

    // Create a transporter using standard SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || '"Intercessor Contact" <contact@intercessor.uk>', // Sender address
      to: contactRecipient, // Receiver address
      subject: `New Contact Request - [${subject}]`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5c43;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    };

    // Send the email to admin
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Intercessor" <contact@intercessor.uk>',
      to: email,
      subject: 'We received your message - INTERCESSOR',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5c43;">Thank you for reaching out</h2>
          <p>Dear ${safeName},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your Message Details:</strong></p>
          <ul>
            <li><strong>Subject:</strong> ${safeSubject}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p>Blessings,<br/><strong>The INTERCESSOR Team</strong></p>
        </div>
      `,
    });

    console.log(`[Contact Form Success] Received submission from ${email} (IP: ${ip})`);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Contact Form Error]', errorMessage, { error });

    return NextResponse.json(
      { success: false, error: 'Failed to send email. Please check server configuration.' },
      { status: 500 }
    );
  }
}
