import { Elysia } from "elysia";
import { verifySvixWebhookSignature } from "../utils/webhooks";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const webhookController = new Elysia({ prefix: "/webhooks" })
  // onParse to capture the raw body string for Svix webhook signature verification
  .onParse(async ({ request, contentType }) => {
    if (contentType === "application/json") {
      return await request.text(); // Returns the raw body string
    }
  })
  .post("/clerk", async ({ body, headers, set }) => {
    // Body is the raw text body due to onParse
    const rawBody = body as string;
    const clerkSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!clerkSecret) {
      console.error("❌ CLERK_WEBHOOK_SECRET is not configured.");
      set.status = 500;
      return { error: "Webhook secret not configured" };
    }

    // Verify the signature
    const isValid = await verifySvixWebhookSignature(rawBody, headers, clerkSecret);
    if (!isValid) {
      console.warn("⚠️ Invalid Clerk webhook signature.");
      set.status = 401;
      return { error: "Invalid signature" };
    }

    // Manually parse JSON after signature verification
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      set.status = 400;
      return { error: "Invalid JSON body" };
    }

    const { type, data } = payload;
    console.log(`📥 Received Clerk webhook event: ${type}`);

    try {
      if (type === "user.created" || type === "user.updated") {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;
        
        // Construct full name if first/last names exist
        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const name = `${firstName} ${lastName}`.trim() || null;

        if (!email) {
          set.status = 400;
          return { error: "User email is missing in Clerk payload" };
        }

        // Upsert user into database (insert if new, update email/name if existing)
        await db
          .insert(users)
          .values({
            clerkId,
            email,
            name,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: users.clerkId,
            set: {
              email,
              name,
              updatedAt: new Date(),
            },
          });

        console.log(`✅ Successfully synced Clerk user: ${clerkId}`);
        return { success: true, message: `User synced successfully` };
      }

      if (type === "user.deleted") {
        const clerkId = data.id;
        
        await db
          .delete(users)
          .where(eq(users.clerkId, clerkId));

        console.log(`✅ Successfully deleted synced user: ${clerkId}`);
        return { success: true, message: `User deleted successfully` };
      }

      // Return success for other unhandled events to acknowledge receipt
      return { success: true, message: `Event type ${type} acknowledged` };
    } catch (error) {
      console.error("❌ Error processing Clerk webhook event:", error);
      set.status = 500;
      return { error: "Failed to process webhook event" };
    }
  });
