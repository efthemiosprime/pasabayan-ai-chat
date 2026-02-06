/**
 * Trip-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";
import { formatTrips, formatTrip, type Trip } from "../utils/formatters.js";

export const tripTools = [
  {
    name: "search_trips",
    description:
      "Search for available carrier trips by route, date, capacity, and status. Use this to help users find trips for their packages or to browse available delivery options.",
    schema: z.object({
      origin_city: z.string().optional().describe("Origin city name (e.g., 'Manila', 'Toronto')"),
      destination_city: z.string().optional().describe("Destination city name"),
      date_from: z.string().optional().describe("Start date for departure (YYYY-MM-DD)"),
      date_to: z.string().optional().describe("End date for departure (YYYY-MM-DD)"),
      min_weight_kg: z.number().optional().describe("Minimum available weight capacity in kg"),
      status: z
        .enum(["planning", "active", "in_transit", "completed"])
        .optional()
        .describe("Trip status filter"),
      transportation_method: z
        .enum(["car", "van", "bus", "truck", "train", "motorcycle", "flight", "other"])
        .optional()
        .describe("Type of transportation"),
      limit: z.number().default(10).describe("Maximum number of results to return"),
    }),
    handler: async (
      params: {
        origin_city?: string;
        destination_city?: string;
        date_from?: string;
        date_to?: string;
        min_weight_kg?: number;
        status?: string;
        transportation_method?: string;
        limit?: number;
      },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Trip[] | { data: Trip[] } }>("/api/trips/available", {
          origin_city: params.origin_city,
          destination_city: params.destination_city,
          departure_date_from: params.date_from,
          departure_date_to: params.date_to,
          min_weight_kg: params.min_weight_kg,
          status: params.status,
          transportation_method: params.transportation_method,
          per_page: params.limit,
        });

        const trips = Array.isArray(response.data) ? response.data : response.data.data || [];
        return formatTrips(trips.slice(0, params.limit || 10));
      } catch (error) {
        return `Error searching trips: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_trip",
    description:
      "Get detailed information about a specific trip by its ID. Returns full trip details including carrier info, route, capacity, and pricing.",
    schema: z.object({
      trip_id: z.number().describe("The trip ID to look up"),
    }),
    handler: async (
      params: { trip_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Trip }>(`/api/trips/${params.trip_id}`);
        return formatTrip(response.data);
      } catch (error) {
        return `Error fetching trip #${params.trip_id}: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_my_trips",
    description:
      "Get the authenticated user's trips (for carriers). Returns all trips created by the current user.",
    schema: z.object({
      status: z
        .enum(["planning", "active", "in_transit", "completed", "cancelled"])
        .optional()
        .describe("Filter by trip status"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { status?: string; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Trip[] | { data: Trip[] } }>("/api/trips", {
          status: params.status,
          per_page: params.limit,
        });

        const trips = Array.isArray(response.data) ? response.data : response.data.data || [];

        if (trips.length === 0) {
          return "You don't have any trips yet. Create a trip to start carrying packages!";
        }

        return formatTrips(trips);
      } catch (error) {
        return `Error fetching your trips: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_trip_compatible_packages",
    description:
      "Find packages that are compatible with a specific trip. Useful for carriers looking to fill their trip capacity.",
    schema: z.object({
      trip_id: z.number().describe("The trip ID to find compatible packages for"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { trip_id: number; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: unknown[] }>(`/api/trips/${params.trip_id}/compatible-packages`, {
          per_page: params.limit,
        });

        const packages = response.data || [];

        if (packages.length === 0) {
          return `No compatible packages found for trip #${params.trip_id}. This could mean the route or timing doesn't match any current package requests.`;
        }

        return `Found ${packages.length} compatible package(s) for trip #${params.trip_id}:\n\n${JSON.stringify(packages, null, 2)}`;
      } catch (error) {
        return `Error finding compatible packages: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];
