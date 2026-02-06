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
    }
  }
}

/**
 * Auth middleware - extracts and validates tokens
 * Supports two modes:
 * 1. Admin mode: Uses X-Admin-Token header
 * 2. User mode: Uses Authorization header with user's Sanctum token
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;
  const adminToken = req.headers["x-admin-token"] as string | undefined;
  const authHeader = req.headers.authorization;
  const userToken = authHeader?.replace("Bearer ", "");

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
    next();
    return;
  }

  // Check for user mode
  if (userToken) {
    req.userToken = userToken;
    req.isAdminMode = false;
    next();
    return;
  }

  // No authentication provided - allow guest/demo mode
  // Guest mode has limited access (no user-specific data)
  req.isAdminMode = false;
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
