import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleMcpToolCall, listMcpTools } from "./handlers";

// Create the Model Context Protocol Server
const server = new Server(
  {
    name: "codeorbit-postgres-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register the list of database tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: listMcpTools(),
  };
});

// Register the tool execution call
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return (await handleMcpToolCall(name, args || {})) as any;
});

// Start the server using standard input/output transport
const transport = new StdioServerTransport();
await server.connect(transport);

// Log to stderr because stdout is reserved strictly for JSON-RPC messages
console.error("🚀 CodeOrbit Postgres MCP Server is running over STDIO...");
