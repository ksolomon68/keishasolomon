import nodemailer from "nodemailer";
import { site } from "@/data/cohortData";

interface SendWelcomeEmailOptions {
  to: string;
  name: string;
  role: "participant" | "admin";
  cohortName?: string;
  password?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || "info@evobrand.net";
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== "false" && port === 465;

  if (!host || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
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
  const fromEmail = process.env.SMTP_FROM || `"The AI Executive Sandbox" <${process.env.SMTP_USER || "info@evobrand.net"}>`;

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
