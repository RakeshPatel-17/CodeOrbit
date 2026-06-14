import crypto from "crypto";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Verifies that two strings are equal without leaking timing information.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

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
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return safeCompare(computedSignature, signature);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return false;
  }
}

/**
 * Verify Svix/Clerk webhook signatures manually.
 * 
 * @param rawBody The raw text body of the request
 * @param headers The HTTP request headers containing svix metadata
 * @param secret The Svix/Clerk signing secret (starts with whsec_)
 */
export async function verifySvixWebhookSignature(
  rawBody: string,
  headers: Record<string, string | undefined>,
  secret: string
): Promise<boolean> {
  const svixId = headers["svix-id"];
  const svixTimestamp = headers["svix-timestamp"];
  const svixSignature = headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature || !secret) {
    return false;
  }

  try {
    // Decode the base64 secret (remove 'whsec_' prefix if present)
    const secretKey = secret.startsWith("whsec_") ? secret.split("_")[1] : secret;
    const secretBuffer = Buffer.from(secretKey, "base64");

    // Format content to sign
    const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;

    // Generate HMAC SHA-256 signature in Base64
    const expectedSignature = crypto
      .createHmac("sha256", secretBuffer)
      .update(signedContent)
      .digest("base64");

    // svix-signature header is in format: v1,sig1 v1,sig2
    const signatures = svixSignature.split(" ");
    for (const sig of signatures) {
      const [version, signatureValue] = sig.split(",");
      if (version === "v1") {
        if (safeCompare(expectedSignature, signatureValue)) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("❌ Svix signature verification failed:", error);
    return false;
  }
}
