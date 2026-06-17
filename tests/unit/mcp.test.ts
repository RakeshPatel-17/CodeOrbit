import { describe, expect, it } from "bun:test";
import { db } from "../../api/db/db";
import { sql } from "drizzle-orm";

// We will import our MCP handlers/logic from the server file we are about to create
// For TDD, this import will initially fail to compile or find the file until we write it.
import { handleMcpToolCall, listMcpTools } from "../../api/mcp/handlers";

describe("Postgres MCP Server (TDD)", () => {
  it("should list available tools correctly", () => {
    const tools = listMcpTools();
    
    expect(tools).toContainEqual(expect.objectContaining({ name: "list_tables" }));
    expect(tools).toContainEqual(expect.objectContaining({ name: "describe_table" }));
    expect(tools).toContainEqual(expect.objectContaining({ name: "execute_query" }));
  });

  it("should list tables present in our schema", async () => {
    const result = await handleMcpToolCall("list_tables", {});
    
    expect(result.isError).toBe(false);
    expect(result.content).toBeArray();
    
    const textContent = result.content[0]?.text;
    expect(textContent).toContain("users");
    expect(textContent).toContain("tenants");
    expect(textContent).toContain("memberships");
  });

  it("should describe the schema of the users table", async () => {
    const result = await handleMcpToolCall("describe_table", { table: "users" });
    
    expect(result.isError).toBe(false);
    const textContent = result.content[0]?.text;
    expect(textContent).toContain("clerk_id");
    expect(textContent).toContain("email");
  });

  it("should safely execute read-only SELECT queries", async () => {
    const result = await handleMcpToolCall("execute_query", {
      query: "SELECT COUNT(*) as count FROM users"
    });
    
    expect(result.isError).toBe(false);
    const textContent = result.content[0]?.text;
    expect(textContent).toContain("count");
  });

  it("should reject modifying or destructive queries (INSERT, UPDATE, DELETE, DROP)", async () => {
    const destructiveQueries = [
      "DROP TABLE users",
      "DELETE FROM users WHERE id = 'xyz'",
      "UPDATE users SET name = 'hacked'",
      "INSERT INTO users (email) VALUES ('hacker@test.com')",
      "ALTER TABLE users ADD COLUMN hacked text"
    ];

    for (const query of destructiveQueries) {
      const result = await handleMcpToolCall("execute_query", { query });
      expect(result.isError).toBe(true);
      expect(result.content[0]?.text).toContain("Forbidden query type");
    }
  });
});
