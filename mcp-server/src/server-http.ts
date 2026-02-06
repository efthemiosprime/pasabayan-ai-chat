/**
 * HTTP Server for MCP Tools
 * Exposes tools via HTTP endpoints for the chat backend to consume
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import { createApiClient } from "./utils/api-client.js";
import { getToolDefinitions, executeTool } from "./tools/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment validation
const MCP_ACCESS_TOKEN = process.env.MCP_ACCESS_TOKEN;
const PASABAYAN_API_URL = process.env.PASABAYAN_API_URL;
const PASABAYAN_ADMIN_TOKEN = process.env.PASABAYAN_ADMIN_TOKEN;

if (!MCP_ACCESS_TOKEN) {
  console.error("MCP_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

if (!PASABAYAN_API_URL) {
  console.error("PASABAYAN_API_URL environment variable is required");
  process.exit(1);
}

/**
 * Auth middleware - validates MCP access token
 */
function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (token !== MCP_ACCESS_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

/**
 * Health check endpoint
 */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pasabayan-mcp-server",
    timestamp: new Date().toISOString(),
  });
});

/**
 * List all available tools
 * GET /tools
 */
app.get("/tools", authMiddleware, (_req, res) => {
  const tools = getToolDefinitions();
  res.json({ tools });
});

/**
 * Execute a tool
 * POST /tools/:name
 *
 * Headers:
 *   Authorization: Bearer <MCP_ACCESS_TOKEN>
 *   X-User-Token: <user's sanctum token> (optional, for user mode)
 *   X-Admin-Mode: true (optional, for admin mode)
 *
 * Body: Tool parameters as JSON
 */
app.post("/tools/:name", authMiddleware, async (req, res) => {
  const toolName = req.params.name;
  const params = req.body || {};

  // Determine which API token to use
  const userToken = req.headers["x-user-token"] as string | undefined;
  const isAdminMode = req.headers["x-admin-mode"] === "true";

  let apiToken: string;
  let isAdmin: boolean;

  if (isAdminMode && PASABAYAN_ADMIN_TOKEN) {
    // Admin mode - use admin token
    apiToken = PASABAYAN_ADMIN_TOKEN;
    isAdmin = true;
  } else if (userToken) {
    // User mode - use user's token
    apiToken = userToken;
    isAdmin = false;
  } else if (PASABAYAN_ADMIN_TOKEN) {
    // Default to admin if no user token provided
    apiToken = PASABAYAN_ADMIN_TOKEN;
    isAdmin = true;
  } else {
    res.status(400).json({
      error: "No API token available. Provide X-User-Token header or configure PASABAYAN_ADMIN_TOKEN.",
    });
    return;
  }

  try {
    const client = createApiClient(apiToken, isAdmin);
    const result = await executeTool(toolName, params, client);

    res.json({
      tool: toolName,
      result,
      mode: isAdmin ? "admin" : "user",
    });
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      tool: toolName,
    });
  }
});

/**
 * Batch execute multiple tools
 * POST /tools/batch
 *
 * Body: { calls: [{ name: string, params: object }] }
 */
app.post("/batch", authMiddleware, async (req, res) => {
  const { calls } = req.body as {
    calls: { name: string; params: Record<string, unknown> }[];
  };

  if (!Array.isArray(calls)) {
    res.status(400).json({ error: "calls must be an array" });
    return;
  }

  const userToken = req.headers["x-user-token"] as string | undefined;
  const isAdminMode = req.headers["x-admin-mode"] === "true";

  let apiToken: string;
  let isAdmin: boolean;

  if (isAdminMode && PASABAYAN_ADMIN_TOKEN) {
    apiToken = PASABAYAN_ADMIN_TOKEN;
    isAdmin = true;
  } else if (userToken) {
    apiToken = userToken;
    isAdmin = false;
  } else if (PASABAYAN_ADMIN_TOKEN) {
    apiToken = PASABAYAN_ADMIN_TOKEN;
    isAdmin = true;
  } else {
    res.status(400).json({ error: "No API token available" });
    return;
  }

  const client = createApiClient(apiToken, isAdmin);

  const results = await Promise.all(
    calls.map(async (call) => {
      try {
        const result = await executeTool(call.name, call.params, client);
        return { tool: call.name, result, success: true };
      } catch (error) {
        return {
          tool: call.name,
          error: error instanceof Error ? error.message : "Unknown error",
          success: false,
        };
      }
    })
  );

  res.json({ results, mode: isAdmin ? "admin" : "user" });
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Pasabayan MCP Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Tools list: http://localhost:${PORT}/tools`);
  console.log(`   API URL: ${PASABAYAN_API_URL}`);
  console.log(`   Admin mode: ${PASABAYAN_ADMIN_TOKEN ? "enabled" : "disabled"}`);
});

export default app;
