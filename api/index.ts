import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { sendEmail } from "./utils/email";

const app = new Elysia({ prefix: "/api" })
  .use(cors()) // Enables CORS for local React development on port 3000
  .get("/hello", () => ({
    status: "success",
    message: "Hello from ElysiaJS backend on CodeOrbit!",
    timestamp: new Date().toISOString()
  }))
  .post("/send-test-email", async ({ body }) => {
    const { email } = body;
    const result = await sendEmail({
      to: email,
      subject: "Welcome to CodeOrbit!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">Welcome to CodeOrbit!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Thank you for testing the email configuration on your serverless ElysiaJS stack.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px;">This is an automated test email sent from your $0-cost Resend integration.</p>
        </div>
      `
    });

    return result;
  }, {
    body: t.Object({
      email: t.String()
    })
  });

export default app;
