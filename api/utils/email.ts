import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = "CodeOrbit <onboarding@resend.dev>" }: SendEmailParams) {
  if (!resend) {
    console.warn("⚠️ Resend is not configured. RESEND_API_KEY is missing.");
    return { success: false, error: "Resend is not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Failed to send email via Resend:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ Exception occurred while sending email:", error);
    return { success: false, error };
  }
}
