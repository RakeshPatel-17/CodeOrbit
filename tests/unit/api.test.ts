import { describe, expect, it } from "bun:test";
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
