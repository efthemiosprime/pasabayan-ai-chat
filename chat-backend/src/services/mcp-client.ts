/**
 * MCP Client - communicates with the MCP server
 */

export interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolResult {
  tool: string;
  result: string;
  mode: "admin" | "user";
}

export class McpClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.accessToken = accessToken;
  }

  /**
   * Get all available tools from the MCP server
   */
  async getTools(): Promise<Tool[]> {
    const response = await fetch(`${this.baseUrl}/tools`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get tools: ${response.status}`);
    }

    const data = (await response.json()) as { tools: Tool[] };
    return data.tools;
  }

  /**
   * Execute a tool on the MCP server
   */
  async executeTool(
    name: string,
    params: Record<string, unknown>,
    options: {
      userToken?: string;
      adminMode?: boolean;
    } = {}
  ): Promise<ToolResult> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    if (options.userToken) {
      headers["X-User-Token"] = options.userToken;
    }

    if (options.adminMode) {
      headers["X-Admin-Mode"] = "true";
    }

    const response = await fetch(`${this.baseUrl}/tools/${name}`, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tool execution failed: ${error}`);
    }

    return response.json() as Promise<ToolResult>;
  }

  /**
   * Execute multiple tools in batch
   */
  async executeBatch(
    calls: { name: string; params: Record<string, unknown> }[],
    options: {
      userToken?: string;
      adminMode?: boolean;
    } = {}
  ): Promise<ToolResult[]> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    if (options.userToken) {
      headers["X-User-Token"] = options.userToken;
    }

    if (options.adminMode) {
      headers["X-Admin-Mode"] = "true";
    }

    const response = await fetch(`${this.baseUrl}/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify({ calls }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Batch execution failed: ${error}`);
    }

    const data = (await response.json()) as { results: ToolResult[] };
    return data.results;
  }

  /**
   * Check if the MCP server is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let mcpClient: McpClient | null = null;

export function getMcpClient(): McpClient {
  if (!mcpClient) {
    const mcpUrl = process.env.MCP_SERVER_URL;
    const mcpToken = process.env.MCP_ACCESS_TOKEN;

    if (!mcpUrl || !mcpToken) {
      throw new Error("MCP_SERVER_URL and MCP_ACCESS_TOKEN are required");
    }

    mcpClient = new McpClient(mcpUrl, mcpToken);
  }

  return mcpClient;
}
