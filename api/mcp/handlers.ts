import { db } from "../db/db";
import { sql } from "drizzle-orm";

interface McpToolContent {
  type: "text";
  text: string;
}

interface McpToolResult {
  isError: boolean;
  content: McpToolContent[];
}

export function listMcpTools() {
  return [
    {
      name: "list_tables",
      description: "List all database tables present in the CodeOrbit Postgres schema.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "describe_table",
      description: "Get the column names and data types for a specific database table.",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string", description: "The name of the database table to describe." },
        },
        required: ["table"],
      },
    },
    {
      name: "execute_query",
      description: "Execute a read-only SELECT database query against the Postgres tables.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "The SQL SELECT statement to execute." },
        },
        required: ["query"],
      },
    },
  ];
}

export async function handleMcpToolCall(name: string, args: any): Promise<McpToolResult> {
  try {
    if (name === "list_tables") {
      const result = await db.execute<{ table_name: string }>(
        sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
      );
      
      const tablesList = result.rows.map((r) => r.table_name).join(", ");
      return {
        isError: false,
        content: [{ type: "text", text: `Available tables: ${tablesList}` }],
      };
    }

    if (name === "describe_table") {
      const tableName = args.table;
      if (!tableName || typeof tableName !== "string") {
        return {
          isError: true,
          content: [{ type: "text", text: "Table name is required and must be a string." }],
        };
      }

      // Safe parameter substitution check to prevent SQL injection in catalog table name matching
      const result = await db.execute<{ column_name: string; data_type: string; is_nullable: string }>(
        sql`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = ${tableName} AND table_schema = 'public'`
      );

      if (result.rows.length === 0) {
        return {
          isError: true,
          content: [{ type: "text", text: `Table '${tableName}' not found or has no columns.` }],
        };
      }

      const columnsDesc = result.rows
        .map((r) => `Column: ${r.column_name} (${r.data_type}, nullable: ${r.is_nullable})`)
        .join("\n");
      
      return {
        isError: false,
        content: [{ type: "text", text: `Schema of '${tableName}':\n${columnsDesc}` }],
      };
    }

    if (name === "execute_query") {
      const queryStr = args.query;
      if (!queryStr || typeof queryStr !== "string") {
        return {
          isError: true,
          content: [{ type: "text", text: "SQL query statement is required." }],
        };
      }

      // 🛡️ Safe Read-Only SQL Validator
      const cleaned = queryStr.trim().toLowerCase();
      
      // Enforce starting with SELECT or WITH
      if (!cleaned.startsWith("select") && !cleaned.startsWith("with")) {
        return {
          isError: true,
          content: [{ type: "text", text: "Forbidden query type. Only SELECT queries are permitted." }],
        };
      }

      // Enforce exclusion of write keywords as whole words
      const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate", "create", "grant", "revoke", "replace", "into"];
      for (const word of forbidden) {
        const regex = new RegExp(`\\b${word}\\b`, "i");
        if (regex.test(cleaned)) {
          return {
            isError: true,
            content: [{ type: "text", text: `Forbidden query type: query contains keyword '${word}'.` }],
          };
        }
      }

      // Execute query directly
      const queryResult = await db.execute(sql.raw(queryStr));
      return {
        isError: false,
        content: [{ type: "text", text: JSON.stringify(queryResult, null, 2) }],
      };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool name: ${name}` }],
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error executing database tool: ${error.message}` }],
    };
  }
}
