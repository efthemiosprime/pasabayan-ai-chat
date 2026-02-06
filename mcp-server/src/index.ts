/**
 * Pasabayan MCP Server
 *
 * This is the entry point for the MCP server. For HTTP mode, use server-http.ts
 * This file is for stdio-based MCP protocol (used with Claude Desktop/Claude Code)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createApiClient } from "./utils/api-client.js";
import { allTools, executeTool } from "./tools/index.js";

const PASABAYAN_API_URL = process.env.PASABAYAN_API_URL;
const PASABAYAN_ADMIN_TOKEN = process.env.PASABAYAN_ADMIN_TOKEN;

if (!PASABAYAN_API_URL) {
  console.error("PASABAYAN_API_URL environment variable is required");
  process.exit(1);
}

if (!PASABAYAN_ADMIN_TOKEN) {
  console.error("PASABAYAN_ADMIN_TOKEN environment variable is required");
  process.exit(1);
}

// Create MCP server
const server = new McpServer({
  name: "pasabayan",
  version: "1.0.0",
});

// Create admin API client for stdio mode
const adminClient = createApiClient(PASABAYAN_ADMIN_TOKEN, true);

// Register all tools
for (const tool of allTools) {
  // Convert Zod schema to JSON schema for MCP
  const shape = tool.schema.shape;
  const properties: Record<string, { type: string; description?: string }> = {};

  for (const [key, value] of Object.entries(shape)) {
    const zodValue = value as { description?: string; _def?: { typeName?: string } };
    properties[key] = {
      type: "string", // Simplified - MCP will handle conversion
      description: zodValue.description,
    };
  }

  server.tool(
    tool.name,
    tool.description,
    properties,
    async (params: Record<string, unknown>) => {
      const result = await executeTool(tool.name, params, adminClient);
      return {
        content: [{ type: "text", text: result }],
      };
    }
  );
}

// Start server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pasabayan MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
