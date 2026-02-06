/**
 * Package-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";
import { formatPackages, formatPackage, type Package } from "../utils/formatters.js";

export const packageTools = [
  {
    name: "search_packages",
    description:
      "Search for package delivery requests by route, urgency, weight, and status. Use this to help carriers find packages to deliver or shippers to see available requests.",
    schema: z.object({
      pickup_city: z.string().optional().describe("Pickup city name"),
      delivery_city: z.string().optional().describe("Delivery city name"),
      urgency: z
        .enum(["flexible", "normal", "urgent", "express"])
        .optional()
        .describe("Urgency level filter"),
      max_weight_kg: z.number().optional().describe("Maximum package weight in kg"),
      fragile: z.boolean().optional().describe("Filter for fragile packages only"),
      status: z
        .enum(["open", "matched", "delivered"])
        .optional()
        .describe("Package request status"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: {
        pickup_city?: string;
        delivery_city?: string;
        urgency?: string;
        max_weight_kg?: number;
        fragile?: boolean;
        status?: string;
        limit?: number;
      },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Package[] | { data: Package[] } }>("/api/packages/available", {
          pickup_city: params.pickup_city,
          delivery_city: params.delivery_city,
          urgency_level: params.urgency,
          max_weight_kg: params.max_weight_kg,
          fragile: params.fragile,
          status: params.status,
          per_page: params.limit,
        });

        const packages = Array.isArray(response.data) ? response.data : response.data.data || [];
        return formatPackages(packages.slice(0, params.limit || 10));
      } catch (error) {
        return `Error searching packages: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_package",
    description:
      "Get detailed information about a specific package request by its ID. Returns full package details including dimensions, value, and shipper info.",
    schema: z.object({
      package_id: z.number().describe("The package ID to look up"),
    }),
    handler: async (
      params: { package_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Package }>(`/api/packages/${params.package_id}`);
        return formatPackage(response.data);
      } catch (error) {
        return `Error fetching package #${params.package_id}: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_my_packages",
    description:
      "Get the authenticated user's package requests (for shippers). Returns all packages created by the current user.",
    schema: z.object({
      status: z
        .enum(["open", "matched", "delivered"])
        .optional()
        .describe("Filter by package status"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { status?: string; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Package[] | { data: Package[] } }>("/api/packages", {
          status: params.status,
          per_page: params.limit,
        });

        const packages = Array.isArray(response.data) ? response.data : response.data.data || [];

        if (packages.length === 0) {
          return "You don't have any package requests yet. Create a package request to find a carrier!";
        }

        return formatPackages(packages);
      } catch (error) {
        return `Error fetching your packages: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_package_compatible_trips",
    description:
      "Find trips that are compatible with a specific package. Useful for shippers looking for carriers to deliver their package.",
    schema: z.object({
      package_id: z.number().describe("The package ID to find compatible trips for"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { package_id: number; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: unknown[] }>(`/api/packages/${params.package_id}/compatible-trips`, {
          per_page: params.limit,
        });

        const trips = response.data || [];

        if (trips.length === 0) {
          return `No compatible trips found for package #${params.package_id}. This could mean no carriers are traveling on this route soon.`;
        }

        return `Found ${trips.length} compatible trip(s) for package #${params.package_id}:\n\n${JSON.stringify(trips, null, 2)}`;
      } catch (error) {
        return `Error finding compatible trips: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];
