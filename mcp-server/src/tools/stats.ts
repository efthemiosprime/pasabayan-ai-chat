/**
 * Statistics-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";
import { formatStats, type Stats } from "../utils/formatters.js";

export const statsTools = [
  {
    name: "get_carrier_stats",
    description:
      "Get carrier performance statistics including trips, earnings, and ratings. For regular users, returns their own stats. Admins can look up any carrier.",
    schema: z.object({
      user_id: z
        .number()
        .optional()
        .describe("User ID to get stats for (admin only, omit for own stats)"),
    }),
    handler: async (
      params: { user_id?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        let endpoint = "/api/carrier/stats";

        if (params.user_id) {
          if (!client.isAdmin()) {
            return "You can only view your own carrier stats. Omit the user_id parameter.";
          }
          endpoint = `/api/users/${params.user_id}/carrier-stats`;
        }

        const response = await client.get<{ data: Stats }>("/api/carrier/stats");
        return `**Carrier Statistics:**\n\n${formatStats(response.data, "carrier")}`;
      } catch (error) {
        return `Error fetching carrier stats: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_shipper_stats",
    description:
      "Get shipper performance statistics including packages, spending, and ratings. For regular users, returns their own stats. Admins can look up any shipper.",
    schema: z.object({
      user_id: z
        .number()
        .optional()
        .describe("User ID to get stats for (admin only, omit for own stats)"),
    }),
    handler: async (
      params: { user_id?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        let endpoint = "/api/shipper/stats";

        if (params.user_id) {
          if (!client.isAdmin()) {
            return "You can only view your own shipper stats. Omit the user_id parameter.";
          }
          endpoint = `/api/users/${params.user_id}/shipper-stats`;
        }

        const response = await client.get<{ data: Stats }>("/api/shipper/stats");
        return `**Shipper Statistics:**\n\n${formatStats(response.data, "shipper")}`;
      } catch (error) {
        return `Error fetching shipper stats: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_my_stats",
    description:
      "Get combined statistics for users who are both carriers and shippers. Returns both carrier and shipper stats in one response.",
    schema: z.object({}),
    handler: async (_params: object, client: ApiClient): Promise<string> => {
      try {
        const response = await client.get<{
          data: {
            carrier?: Stats;
            shipper?: Stats;
          };
        }>("/api/user/stats");

        const stats = response.data;
        const parts: string[] = [];

        if (stats.carrier) {
          parts.push(`**As a Carrier:**\n${formatStats(stats.carrier, "carrier")}`);
        }

        if (stats.shipper) {
          parts.push(`**As a Shipper:**\n${formatStats(stats.shipper, "shipper")}`);
        }

        if (parts.length === 0) {
          return "No statistics available yet. Start using the platform to see your stats!";
        }

        return parts.join("\n\n---\n\n");
      } catch (error) {
        return `Error fetching stats: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_platform_stats",
    description:
      "Get platform-wide statistics including total users, trips, deliveries, and revenue. Admin only.",
    schema: z.object({
      period: z
        .enum(["today", "week", "month", "year", "all"])
        .default("today")
        .describe("Time period for statistics"),
    }),
    handler: async (
      params: { period: string },
      client: ApiClient
    ): Promise<string> => {
      if (!client.isAdmin()) {
        return "Platform statistics are only available to administrators.";
      }

      try {
        const response = await client.get<{
          data: {
            users?: { total: number; new: number; active: number };
            trips?: { total: number; active: number; completed: number };
            packages?: { total: number; open: number; delivered: number };
            matches?: { total: number; active: number; completed: number };
            revenue?: { total: number; fees: number };
          };
        }>("/api/admin/statistics", {
          period: params.period,
        });

        const stats = response.data;
        const lines = [
          `**Platform Statistics (${params.period}):**`,
          "",
        ];

        if (stats.users) {
          lines.push("**Users:**");
          lines.push(`  Total: ${stats.users.total}`);
          lines.push(`  New (this period): ${stats.users.new}`);
          lines.push(`  Active: ${stats.users.active}`);
          lines.push("");
        }

        if (stats.trips) {
          lines.push("**Trips:**");
          lines.push(`  Total: ${stats.trips.total}`);
          lines.push(`  Active: ${stats.trips.active}`);
          lines.push(`  Completed: ${stats.trips.completed}`);
          lines.push("");
        }

        if (stats.packages) {
          lines.push("**Packages:**");
          lines.push(`  Total requests: ${stats.packages.total}`);
          lines.push(`  Open: ${stats.packages.open}`);
          lines.push(`  Delivered: ${stats.packages.delivered}`);
          lines.push("");
        }

        if (stats.matches) {
          lines.push("**Matches:**");
          lines.push(`  Total: ${stats.matches.total}`);
          lines.push(`  Active: ${stats.matches.active}`);
          lines.push(`  Completed: ${stats.matches.completed}`);
          lines.push("");
        }

        if (stats.revenue) {
          lines.push("**Revenue:**");
          lines.push(`  Total GMV: $${stats.revenue.total.toFixed(2)}`);
          lines.push(`  Platform fees: $${stats.revenue.fees.toFixed(2)}`);
        }

        return lines.join("\n");
      } catch (error) {
        return `Error fetching platform stats: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_popular_routes",
    description:
      "Get the most popular delivery routes on the platform. Useful for understanding demand patterns.",
    schema: z.object({
      limit: z.number().default(10).describe("Number of routes to return"),
    }),
    handler: async (
      params: { limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{
          data: {
            origin: string;
            destination: string;
            count: number;
          }[];
        }>("/api/routes/popular-packages", {
          limit: params.limit,
        });

        const routes = response.data || [];

        if (routes.length === 0) {
          return "No route data available yet.";
        }

        const formatted = routes.map((r, i) => {
          return `${i + 1}. ${r.origin} → ${r.destination} (${r.count} deliveries)`;
        });

        return `**Most Popular Routes:**\n\n${formatted.join("\n")}`;
      } catch (error) {
        return `Error fetching popular routes: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];
