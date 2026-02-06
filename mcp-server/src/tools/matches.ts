/**
 * Match-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";
import { formatMatches, formatMatch, type Match } from "../utils/formatters.js";

export const matchTools = [
  {
    name: "list_matches",
    description:
      "List delivery matches for the authenticated user. Shows all active and past delivery matches where the user is either the carrier or shipper.",
    schema: z.object({
      status: z
        .enum([
          "carrier_requested",
          "shipper_requested",
          "shipper_accepted",
          "carrier_accepted",
          "confirmed",
          "picked_up",
          "in_transit",
          "delivered",
          "cancelled",
        ])
        .optional()
        .describe("Filter by match status"),
      role: z
        .enum(["carrier", "shipper"])
        .optional()
        .describe("Filter by user's role in the match"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { status?: string; role?: string; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Match[] | { data: Match[] } }>("/api/matches", {
          status: params.status,
          role: params.role,
          per_page: params.limit,
        });

        const matches = Array.isArray(response.data) ? response.data : response.data.data || [];

        if (matches.length === 0) {
          return "No matches found. Matches are created when carriers and shippers agree to work together on a delivery.";
        }

        return formatMatches(matches);
      } catch (error) {
        return `Error fetching matches: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_match",
    description:
      "Get detailed information about a specific delivery match. Returns full match details including carrier, shipper, trip, package, and status timeline.",
    schema: z.object({
      match_id: z.number().describe("The match ID to look up"),
    }),
    handler: async (
      params: { match_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Match }>(`/api/matches/${params.match_id}`);
        return formatMatch(response.data);
      } catch (error) {
        return `Error fetching match #${params.match_id}: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_active_deliveries",
    description:
      "Get all active deliveries (matches that are in progress). This includes confirmed, picked up, and in-transit deliveries.",
    schema: z.object({
      limit: z.number().default(20).describe("Maximum number of results"),
    }),
    handler: async (
      params: { limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        // Fetch matches with active statuses
        const statuses = ["confirmed", "picked_up", "in_transit"];
        const allMatches: Match[] = [];

        for (const status of statuses) {
          try {
            const response = await client.get<{ data: Match[] | { data: Match[] } }>("/api/matches", {
              status,
              per_page: params.limit,
            });
            const matches = Array.isArray(response.data) ? response.data : response.data.data || [];
            allMatches.push(...matches);
          } catch {
            // Continue if one status fails
          }
        }

        if (allMatches.length === 0) {
          return "No active deliveries found. Active deliveries are matches that have been confirmed and are in progress.";
        }

        return `**Active Deliveries:**\n\n${formatMatches(allMatches)}`;
      } catch (error) {
        return `Error fetching active deliveries: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_carrier_location",
    description:
      "Get the current location of a carrier for a specific match. Only available for matches that are in progress (confirmed, picked_up, or in_transit).",
    schema: z.object({
      match_id: z.number().describe("The match ID to get carrier location for"),
    }),
    handler: async (
      params: { match_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{
          data: {
            latitude: number;
            longitude: number;
            updated_at: string;
            match_status: string;
          };
        }>(`/api/matches/${params.match_id}/carrier-location`);

        const location = response.data;

        if (!location.latitude || !location.longitude) {
          return `No location data available for match #${params.match_id}. The carrier may not have shared their location yet.`;
        }

        return `**Carrier Location for Match #${params.match_id}:**
📍 Latitude: ${location.latitude}
📍 Longitude: ${location.longitude}
🕐 Last updated: ${location.updated_at}
📦 Match status: ${location.match_status}

You can view this on a map at:
https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      } catch (error) {
        return `Error fetching carrier location: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_match_timeline",
    description:
      "Get the status timeline/history for a delivery match. Shows when each status change occurred.",
    schema: z.object({
      match_id: z.number().describe("The match ID to get timeline for"),
    }),
    handler: async (
      params: { match_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Match }>(`/api/matches/${params.match_id}`);
        const match = response.data;

        const timeline: string[] = [
          `**Match #${match.id} Timeline:**`,
          "",
          `📝 Created: Match initiated`,
          `   Status: ${match.match_status}`,
        ];

        if (match.confirmed_at) {
          timeline.push(`✅ Confirmed: ${new Date(match.confirmed_at).toLocaleString()}`);
        }
        if (match.picked_up_at) {
          timeline.push(`📦 Picked up: ${new Date(match.picked_up_at).toLocaleString()}`);
        }
        if (match.delivered_at) {
          timeline.push(`🎉 Delivered: ${new Date(match.delivered_at).toLocaleString()}`);
        }

        timeline.push("");
        timeline.push(`Current Status: ${match.match_status}`);

        return timeline.join("\n");
      } catch (error) {
        return `Error fetching match timeline: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];
