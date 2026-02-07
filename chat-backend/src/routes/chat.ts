/**
 * Chat routes
 */

import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { processChat, streamChat, type Message } from "../services/claude.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// In-memory conversation store (replace with Redis/DB for production)
const conversations = new Map<
  string,
  {
    messages: Message[];
    createdAt: Date;
    mode: "admin" | "user" | "developer" | "qa";
  }
>();

// Helper to determine mode
function getMode(req: Request): "admin" | "user" | "developer" | "qa" {
  if (req.isDeveloperMode) return "developer";
  if (req.isAdminMode) return "admin";
  if (req.isQAMode) return "qa";
  return "user";
}

// Clean up old conversations periodically (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [id, conv] of conversations) {
    if (now - conv.createdAt.getTime() > maxAge) {
      conversations.delete(id);
    }
  }
}, 60 * 60 * 1000); // Run every hour

/**
 * POST /api/chat
 * Main chat endpoint
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({
        error: "Message is required",
        code: "MISSING_MESSAGE",
      });
      return;
    }

    // Get or create conversation
    let convId = conversationId;
    let conversation = convId ? conversations.get(convId) : null;

    if (!conversation) {
      convId = uuidv4();
      conversation = {
        messages: [],
        createdAt: new Date(),
        mode: getMode(req),
      };
      conversations.set(convId, conversation);
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
    });

    // Process with Claude
    const result = await processChat(conversation.messages, {
      userToken: req.userToken,
      adminMode: req.isAdminMode,
      developerMode: req.isDeveloperMode,
      qaMode: req.isQAMode,
    });

    // Add assistant response
    conversation.messages.push({
      role: "assistant",
      content: result.response,
    });

    res.json({
      message: result.response,
      conversationId: convId,
      toolsUsed: result.toolsUsed,
      mode: getMode(req),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
      code: "CHAT_ERROR",
    });
  }
});

/**
 * POST /api/chat/stream
 * Streaming chat endpoint (Server-Sent Events)
 */
router.post("/stream", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({
        error: "Message is required",
        code: "MISSING_MESSAGE",
      });
      return;
    }

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Get or create conversation
    let convId = conversationId;
    let conversation = convId ? conversations.get(convId) : null;

    if (!conversation) {
      convId = uuidv4();
      conversation = {
        messages: [],
        createdAt: new Date(),
        mode: getMode(req),
      };
      conversations.set(convId, conversation);
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
    });

    // Send conversation ID immediately
    res.write(`data: ${JSON.stringify({ type: "meta", conversationId: convId })}\n\n`);

    // Stream response
    let fullResponse = "";
    for await (const chunk of streamChat(conversation.messages, {
      userToken: req.userToken,
      adminMode: req.isAdminMode,
      developerMode: req.isDeveloperMode,
      qaMode: req.isQAMode,
    })) {
      if (chunk.type === "text") {
        fullResponse += chunk.content;
      }
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    // Add assistant response to conversation
    if (fullResponse) {
      conversation.messages.push({
        role: "assistant",
        content: fullResponse,
      });
    }

    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        content: error instanceof Error ? error.message : "An error occurred",
      })}\n\n`
    );
    res.end();
  }
});

/**
 * GET /api/chat/:conversationId
 * Get conversation history
 */
router.get("/:conversationId", authMiddleware, (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const conversation = conversations.get(conversationId);

  if (!conversation) {
    res.status(404).json({
      error: "Conversation not found",
      code: "NOT_FOUND",
    });
    return;
  }

  res.json({
    conversationId,
    messages: conversation.messages,
    mode: conversation.mode,
    createdAt: conversation.createdAt,
  });
});

/**
 * DELETE /api/chat/:conversationId
 * Delete a conversation
 */
router.delete("/:conversationId", authMiddleware, (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const deleted = conversations.delete(conversationId);

  if (!deleted) {
    res.status(404).json({
      error: "Conversation not found",
      code: "NOT_FOUND",
    });
    return;
  }

  res.json({
    success: true,
    message: "Conversation deleted",
  });
});

/**
 * POST /api/chat/new
 * Start a new conversation
 */
router.post("/new", authMiddleware, (req: Request, res: Response) => {
  const convId = uuidv4();
  const conversation = {
    messages: [] as Message[],
    createdAt: new Date(),
    mode: getMode(req),
  };
  conversations.set(convId, conversation);

  res.json({
    conversationId: convId,
    mode: conversation.mode,
    createdAt: conversation.createdAt,
  });
});

export default router;
