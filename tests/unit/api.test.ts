import { describe, expect, it } from "bun:test";

// Inject mock webhook secret for testing signature validation
process.env.CLERK_WEBHOOK_SECRET = "whsec_MOCK_SECRET_KEY_FOR_TESTS_ONLY_BASE64_DECODABLE";

import app from "../../api/index";

describe("Elysia API Server", () => {
  it("should return hello message on /api/hello", async () => {
    // Querying Elysia in-memory by passing a standard Request object directly to app.handle()
    const response = await app.handle(new Request("http://localhost/api/hello"));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.status).toBe("success");
    expect(json.message).toBe("Hello from ElysiaJS backend on CodeOrbit!");
    expect(json.timestamp).toBeDefined();
  });
});

describe("Clerk Webhooks Gate", () => {
  it("should reject webhook request if signature is invalid", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/webhooks/clerk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": "msg_test123",
          "svix-timestamp": "1718412345",
          "svix-signature": "v1,invalid_sig_value_here",
        },
        body: JSON.stringify({
          type: "user.created",
          data: { id: "user_test123" }
        }),
      })
    );

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe("Invalid signature");
  });
});

describe("File Uploads Gate", () => {
  it("should reject upload request if no file is provided", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body
      })
    );

    expect(response.status).toBe(422); // Unprocessable Entity due to missing t.File() body
  });
});
