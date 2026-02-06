/**
 * Pasabayan Chat Backend
 * Main entry point
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chat.js";
import { getMcpClient } from "./services/mcp-client.js";

const app = express();

// Environment validation
const requiredEnvVars = [
  "ANTHROPIC_API_KEY",
  "MCP_SERVER_URL",
  "MCP_ACCESS_TOKEN",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} environment variable is required`);
    process.exit(1);
  }
}

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // Higher limit for admin
    const adminToken = req.headers["x-admin-token"];
    return adminToken ? 100 : 30;
  },
  message: {
    error: "Too many requests, please try again later",
    code: "RATE_LIMITED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get("/health", async (_req, res) => {
  try {
    const mcpClient = getMcpClient();
    const mcpHealthy = await mcpClient.healthCheck();

    res.json({
      status: mcpHealthy ? "ok" : "degraded",
      service: "pasabayan-chat-backend",
      mcp: mcpHealthy ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      service: "pasabayan-chat-backend",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Chat routes
app.use("/api/chat", chatLimiter, chatRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
    code: "NOT_FOUND",
  });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
);

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Pasabayan Chat Backend running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`   MCP Server: ${process.env.MCP_SERVER_URL}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
});

export default app;
