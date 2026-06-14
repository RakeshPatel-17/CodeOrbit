import { Bun } from "bun";

/**
 * Verify HMAC SHA-256 signature for incoming webhooks (Zapier, Pipedream, Clerk, etc.)
 * standardizing verification to protect serverless api endpoints.
 * 
 * @param payload The raw string payload (request body)
 * @param signature The signature header sent by the provider
 * @param secret The webhook secret configured in the provider settings
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!signature || !secret) return false;

  try {
    const hmac = Bun.crypto.hmac("sha256", secret);
    const computedSignature = hmac.update(payload).digest("hex");

    // Constant-time comparison to prevent timing attacks
    return Bun.crypto.subtle.compare(
      new TextEncoder().encode(computedSignature),
      new TextEncoder().encode(signature)
    );
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return false;
  }
}
