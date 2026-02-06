/**
 * API client for chat backend
 */

// In production: empty string = relative URLs going through nginx
// In development: http://localhost:3001 for direct backend access
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  toolsUsed?: string[];
  mode: 'admin' | 'user' | 'developer';
}

/**
 * Send a chat message
 */
export async function sendMessage(
  message: string,
  options: {
    conversationId?: string;
    adminToken?: string;
    developerToken?: string;
    userToken?: string;
  } = {}
): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.developerToken) {
    headers['X-Developer-Token'] = options.developerToken;
  } else if (options.adminToken) {
    headers['X-Admin-Token'] = options.adminToken;
  } else if (options.userToken) {
    headers['Authorization'] = `Bearer ${options.userToken}`;
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      conversationId: options.conversationId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  return response.json();
}

/**
 * Get conversation history
 */
export async function getConversation(
  conversationId: string,
  options: {
    adminToken?: string;
    developerToken?: string;
    userToken?: string;
  } = {}
): Promise<{
  conversationId: string;
  messages: Message[];
  mode: 'admin' | 'user' | 'developer';
}> {
  const headers: Record<string, string> = {};

  if (options.developerToken) {
    headers['X-Developer-Token'] = options.developerToken;
  } else if (options.adminToken) {
    headers['X-Admin-Token'] = options.adminToken;
  } else if (options.userToken) {
    headers['Authorization'] = `Bearer ${options.userToken}`;
  }

  const response = await fetch(`${API_URL}/api/chat/${conversationId}`, {
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get conversation');
  }

  return response.json();
}

/**
 * Start a new conversation
 */
export async function newConversation(
  options: {
    adminToken?: string;
    developerToken?: string;
    userToken?: string;
  } = {}
): Promise<{
  conversationId: string;
  mode: 'admin' | 'user' | 'developer';
}> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.developerToken) {
    headers['X-Developer-Token'] = options.developerToken;
  } else if (options.adminToken) {
    headers['X-Admin-Token'] = options.adminToken;
  } else if (options.userToken) {
    headers['Authorization'] = `Bearer ${options.userToken}`;
  }

  const response = await fetch(`${API_URL}/api/chat/new`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create conversation');
  }

  return response.json();
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string,
  options: {
    adminToken?: string;
    developerToken?: string;
    userToken?: string;
  } = {}
): Promise<void> {
  const headers: Record<string, string> = {};

  if (options.developerToken) {
    headers['X-Developer-Token'] = options.developerToken;
  } else if (options.adminToken) {
    headers['X-Admin-Token'] = options.adminToken;
  } else if (options.userToken) {
    headers['Authorization'] = `Bearer ${options.userToken}`;
  }

  const response = await fetch(`${API_URL}/api/chat/${conversationId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete conversation');
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{
  status: string;
  service: string;
  mcp: string;
}> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
