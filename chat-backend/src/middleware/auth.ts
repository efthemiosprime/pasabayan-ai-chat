/**
 * Authentication middleware
 */

import { Request, Response, NextFunction } from "express";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userToken?: string;
      isAdminMode?: boolean;
      isDeveloperMode?: boolean;
      isQAMode?: boolean;
    }
  }
}

/**
 * Auth middleware - extracts and validates tokens
 * Supports four modes:
 * 1. Admin mode: Uses X-Admin-Token header
 * 2. Developer mode: Uses X-Developer-Token header
 * 3. QA mode: Uses X-QA-Mode header (no token required, just flag)
 * 4. User mode: Uses Authorization header with user's Sanctum token
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;
  const DEVELOPER_API_TOKEN = process.env.DEVELOPER_API_TOKEN || ADMIN_API_TOKEN; // Fallback to admin token
  const adminToken = req.headers["x-admin-token"] as string | undefined;
  const developerToken = req.headers["x-developer-token"] as string | undefined;
  const qaMode = req.headers["x-qa-mode"] as string | undefined;
  const authHeader = req.headers.authorization;
  const userToken = authHeader?.replace("Bearer ", "");

  // Check for developer mode first
  if (developerToken) {
    if (developerToken !== DEVELOPER_API_TOKEN) {
      res.status(401).json({
        error: "Invalid developer token",
        code: "INVALID_DEVELOPER_TOKEN",
      });
      return;
    }
    req.isDeveloperMode = true;
    req.isAdminMode = false;
    req.isQAMode = false;
    next();
    return;
  }

  // Check for admin mode
  if (adminToken) {
    if (adminToken !== ADMIN_API_TOKEN) {
      res.status(401).json({
        error: "Invalid admin token",
        code: "INVALID_ADMIN_TOKEN",
      });
      return;
    }
    req.isAdminMode = true;
    req.isDeveloperMode = false;
    req.isQAMode = false;
    next();
    return;
  }

  // Check for QA mode (no token required, just header flag)
  if (qaMode === "true" || qaMode === "1") {
    req.isQAMode = true;
    req.isAdminMode = false;
    req.isDeveloperMode = false;
    req.userToken = undefined;
    next();
    return;
  }

  // Check for user mode
  if (userToken) {
    req.userToken = userToken;
    req.isAdminMode = false;
    req.isDeveloperMode = false;
    req.isQAMode = false;
    next();
    return;
  }

  // No authentication provided - allow guest/demo mode
  // Guest mode has limited access (no user-specific data)
  req.isAdminMode = false;
  req.isDeveloperMode = false;
  req.isQAMode = false;
  req.userToken = undefined;
  next();
}

/**
 * Optional auth middleware - allows unauthenticated requests
 * but still extracts tokens if provided
 */
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;
  const adminToken = req.headers["x-admin-token"] as string | undefined;
  const authHeader = req.headers.authorization;
  const userToken = authHeader?.replace("Bearer ", "");

  if (adminToken && adminToken === ADMIN_API_TOKEN) {
    req.isAdminMode = true;
  } else if (userToken) {
    req.userToken = userToken;
    req.isAdminMode = false;
  }

  next();
}
