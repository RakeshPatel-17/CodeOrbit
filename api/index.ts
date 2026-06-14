import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { rateLimit } from "elysia-rate-limit";
import { sendEmail } from "./utils/email";
import { webhookController } from "./controllers/webhookController";

const app = new Elysia({ prefix: "/api" })
  .use(cors()) // Enables CORS for local React development on port 3000
  .use(webhookController) // Register webhook routes
  .use(rateLimit({
    max: 100, // Limit each IP to 100 requests per minute
    duration: 60000,
  }))
  .use(swagger({
    path: "/docs", // Swagger UI available at /api/docs
    documentation: {
      info: {
        title: "CodeOrbit API Console",
        version: "1.0.0",
        description: "Interactive API documentation for CodeOrbit's ElysiaJS serverless backend."
      }
    }
  }))
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
