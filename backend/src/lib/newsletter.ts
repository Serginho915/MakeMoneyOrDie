import nodemailer from "nodemailer";
import { config } from "../config";

type NewsletterMessage = {
  email: string;
};

export function isNewsletterMailerConfigured(): boolean {
  return Boolean(config.smtpHost && config.smtpPort && config.smtpFrom);
}

export async function sendNewsletterEmail({ email }: NewsletterMessage): Promise<void> {
  if (!isNewsletterMailerConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure ?? config.smtpPort === 465,
    auth:
      config.smtpUser && config.smtpPass
        ? {
            user: config.smtpUser,
            pass: config.smtpPass
          }
        : undefined
  });

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: config.newsletterSubject,
    text:
      "You are on the MakeMoneyOrDie list now. Expect sharp ideas about money, leverage, and building assets that keep working.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="margin: 0 0 12px;">Welcome to MakeMoneyOrDie</h1>
        <p style="margin: 0 0 12px;">
          You are on the list now. Expect sharp ideas about money, leverage, and building assets that keep working.
        </p>
        <p style="margin: 0;">No fluff. No startup cosplay. Just useful signal.</p>
      </div>
    `
  });
}
