/**
 * Tool Registry - exports all MCP tools
 */

import { tripTools } from "./trips.js";
import { packageTools } from "./packages.js";
import { matchTools } from "./matches.js";
import { userTools } from "./users.js";
import { statsTools } from "./stats.js";
import { paymentTools } from "./payments.js";
import { ApiClient } from "../utils/api-client.js";
import { z } from "zod";

// Tool definition type
export interface Tool {
  name: string;
  description: string;
  schema: z.ZodObject<z.ZodRawShape>;
  handler: (params: unknown, client: ApiClient) => Promise<string>;
}

// Export all tools as a flat array
export const allTools: Tool[] = [
  ...tripTools,
  ...packageTools,
  ...matchTools,
  ...userTools,
  ...statsTools,
  ...paymentTools,
] as Tool[];

// Create a map for quick lookup
export const toolMap = new Map<string, Tool>(
  allTools.map((tool) => [tool.name, tool])
);

/**
 * Get tool by name
 */
export function getTool(name: string): Tool | undefined {
  return toolMap.get(name);
}

/**
 * Get all tool definitions for Claude API
 */
export function getToolDefinitions(): {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}[] {
  return allTools.map((tool) => {
    const schema = tool.schema;
    const shape = schema.shape;

    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const zodValue = value as z.ZodTypeAny;
      const isOptional = zodValue.isOptional();

      // Extract the base type by unwrapping optional/default wrappers
      let baseType: z.ZodTypeAny = zodValue;

      // Handle ZodOptional
      if (baseType._def?.typeName === "ZodOptional") {
        baseType = baseType._def.innerType;
      }

      // Handle ZodDefault
      if (baseType._def?.typeName === "ZodDefault") {
        baseType = baseType._def.innerType;
      }

      // Handle nested optional inside default
      if (baseType._def?.typeName === "ZodOptional") {
        baseType = baseType._def.innerType;
      }

      // Build property definition
      const prop: Record<string, unknown> = {};

      if (baseType instanceof z.ZodString) {
        prop.type = "string";
      } else if (baseType instanceof z.ZodNumber) {
        prop.type = "number";
      } else if (baseType instanceof z.ZodBoolean) {
        prop.type = "boolean";
      } else if (baseType instanceof z.ZodEnum) {
        prop.type = "string";
        prop.enum = baseType.options;
      } else {
        prop.type = "string";
      }

      // Add description if available
      if (zodValue.description) {
        prop.description = zodValue.description;
      }

      properties[key] = prop;

      if (!isOptional && !(zodValue instanceof z.ZodDefault)) {
        required.push(key);
      }
    }

    return {
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: "object" as const,
        properties,
        ...(required.length > 0 ? { required } : {}),
      },
    };
  });
}

/**
 * Execute a tool by name
 */
export async function executeTool(
  name: string,
  params: unknown,
  client: ApiClient
): Promise<string> {
  const tool = getTool(name);

  if (!tool) {
    return `Unknown tool: ${name}. Available tools: ${allTools.map((t) => t.name).join(", ")}`;
  }

  try {
    // Validate params
    const validatedParams = tool.schema.parse(params);
    return await tool.handler(validatedParams, client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return `Invalid parameters for ${name}: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`;
    }
    return `Error executing ${name}: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
