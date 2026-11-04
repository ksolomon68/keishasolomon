import nodemailer from "nodemailer";
import { site } from "@/data/cohortData";
import type { PlanInquiry } from "./store/types";
import { inquiryNotification } from "./inquiry-notification";

interface SendWelcomeEmailOptions {
  to: string;
  name: string;
  role: "participant" | "admin";
  cohortName?: string;
  password?: string;
}

function getTransporter(timeouts?: { connectionTimeout: number; greetingTimeout: number; socketTimeout: number }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || "info@evobrandai.com";
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== "false" && port === 465;

  if (!host || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    ...timeouts,
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true',
    },
  });
}

/** The inquiry is already saved. Delivery failure must never discard it or invite duplicate submission. */
export async function sendInquiryNotification(inquiry: PlanInquiry): Promise<{ sent: boolean; error?: string }> {
  try {
    const transporter = getTransporter({ connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000 });
    if (!transporter) return { sent: false, error: "SMTP not configured" };
    await transporter.sendMail({
      ...inquiryNotification(inquiry, site.url),
      from: process.env.SMTP_FROM || `"The AI Executive Sandbox" <${process.env.SMTP_USER || "info@evobrandai.com"}>`,
    });
    return { sent: true };
  } catch (error) {
    const code = (error as { code?: string })?.code;
    return { sent: false, error: code && /^[A-Z0-9_]+$/.test(code) ? code : "EMAIL_DELIVERY_FAILED" };
  }
}

export async function sendWelcomeEmail({
  to,
  name,
  role,
  cohortName,
  password,
}: SendWelcomeEmailOptions): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const loginUrl = `${siteUrl}/login`;
  const fromEmail = process.env.SMTP_FROM || `"The AI Executive Sandbox" <${process.env.SMTP_USER || "info@evobrandai.com"}>`;

  if (!transporter) {
    console.warn("[Email] SMTP configuration missing (SMTP_HOST / SMTP_PASS). Skipping email dispatch.");
    return { sent: false, error: "SMTP not configured" };
  }

  const roleDescription =
    role === "admin"
      ? "an Administrator"
      : `a Participant in ${cohortName || "the cohort"}`;

  const subject = `Welcome to ${site.name} — Your Account Credentials`;

  const textContent = `
Hello ${name},

You have been added as ${roleDescription} on ${site.name}.

Here are your account details:
• Portal URL: ${loginUrl}
• Email: ${to}
${password ? `• Temporary Password: ${password}\n` : ""}
Please sign in and start exploring your dashboard. For security, you can update your credentials as needed.

Best regards,
Keisha Solomon
${site.name} · EVOBRAND Concepts
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; color: #1e293b; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; padding: 32px; border-radius: 4px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 22px; font-weight: 600; color: #0f172a; margin: 0; }
    .badge { display: inline-block; padding: 4px 8px; background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; border-radius: 2px; margin-top: 8px; }
    .content { font-size: 15px; line-height: 1.6; color: #334155; }
    .card { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 4px; margin: 20px 0; }
    .button { display: inline-block; background-color: #f59e0b; color: #0f172a; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 2px; margin-top: 16px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">${site.name}</h1>
      <span class="badge">${role === "admin" ? "Admin Access" : "Cohort Participant"}</span>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>You have been registered as <strong>${roleDescription}</strong> on <em>${site.name}</em>.</p>
      
      <div class="card">
        <p style="margin: 0 0 8px 0;"><strong>Your Login Credentials:</strong></p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <code>${to}</code></p>
        ${password ? `<p style="margin: 4px 0;"><strong>Temporary Password:</strong> <code style="background:#e2e8f0; padding:2px 6px; border-radius:2px;">${password}</code></p>` : ""}
      </div>

      <p>Click below to sign in to your dashboard and get started:</p>
      <p><a href="${loginUrl}" class="button">Sign in to Portal</a></p>
    </div>
    <div class="footer">
      <p>Taught by Keisha Solomon · <a href="https://evobrand.net" style="color:#64748b;">EVOBRAND Concepts</a></p>
      <p style="margin-top: 4px;">If you have any questions, reply directly to this email or visit <a href="${siteUrl}" style="color:#64748b;">${siteUrl}</a>.</p>
    </div>
  </div>
</body>
</html>
`.trim();

  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return { sent: true };
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    };
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends a one-time reset link. Returns sent: false (never throws) so callers keep a uniform response. */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  expiresInMinutes,
}: {
  to: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, error: "SMTP not configured" };
  const fromEmail = process.env.SMTP_FROM || `"The AI Executive Sandbox" <${process.env.SMTP_USER || "info@evobrandai.com"}>`;
  const text = `
Hello ${name},

Someone asked to reset the password for your ${site.name} account. To choose a new password, open this link:

${resetUrl}

The link works once and expires in ${expiresInMinutes} minutes. If you didn't ask for this, ignore this email; your password stays the same.

${site.name} · EVOBRAND Concepts
`.trim();
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f7f9fa; color:#1e293b; padding:24px;">
  <div style="max-width:580px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; padding:32px;">
    <h1 style="font-size:22px; color:#0f172a; margin:0 0 20px;">${site.name}</h1>
    <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p>Someone asked to reset the password for your account. Select the button to choose a new password.</p>
    <p><a href="${escapeHtml(resetUrl)}" style="display:inline-block; background:#f59e0b; color:#0f172a; font-weight:600; text-decoration:none; padding:12px 24px;">Choose a new password</a></p>
    <p style="font-size:14px; color:#475569;">The link works once and expires in ${expiresInMinutes} minutes. If you didn't ask for this, ignore this email; your password stays the same.</p>
  </div>
</body>
</html>
`.trim();
  try {
    await transporter.sendMail({ from: fromEmail, to, subject: `Reset your ${site.name} password`, text, html });
    return { sent: true };
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
    return { sent: false, error: error instanceof Error ? error.message : "Unknown error sending email" };
  }
}
