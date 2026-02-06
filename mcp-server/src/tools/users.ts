/**
 * User-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";
import { formatUser, type User } from "../utils/formatters.js";

export const userTools = [
  {
    name: "get_my_profile",
    description:
      "Get the authenticated user's own profile information. Returns details like name, email, roles, ratings, and verification status.",
    schema: z.object({}),
    handler: async (_params: object, client: ApiClient): Promise<string> => {
      try {
        const response = await client.get<{ data?: User } & User>("/api/user");
        const user = response.data || response;
        return formatUser(user as User);
      } catch (error) {
        return `Error fetching your profile: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_user_profile",
    description:
      "Get a user's profile by their ID. Admin only - use this to look up user details for support purposes.",
    schema: z.object({
      user_id: z.number().describe("The user ID to look up"),
    }),
    handler: async (
      params: { user_id: number },
      client: ApiClient
    ): Promise<string> => {
      if (!client.isAdmin()) {
        return "This tool requires admin access. You can only view your own profile with get_my_profile.";
      }

      try {
        const response = await client.get<{ data: User }>(`/api/users/${params.user_id}`);
        return formatUser(response.data);
      } catch (error) {
        return `Error fetching user #${params.user_id}: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "find_user_by_email",
    description:
      "Find a user by their email address. Admin only - use this to look up users when you only have their email.",
    schema: z.object({
      email: z.string().email().describe("The email address to search for"),
    }),
    handler: async (
      params: { email: string },
      client: ApiClient
    ): Promise<string> => {
      if (!client.isAdmin()) {
        return "This tool requires admin access. Regular users cannot search for other users.";
      }

      try {
        const response = await client.get<{ data: User }>("/api/users/find", {
          email: params.email,
        });
        return formatUser(response.data);
      } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
          return `No user found with email: ${params.email}`;
        }
        return `Error searching for user: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_user_ratings",
    description:
      "Get ratings and reviews for a specific user. Shows their rating history and feedback from other users.",
    schema: z.object({
      user_id: z.number().describe("The user ID to get ratings for"),
      limit: z.number().default(10).describe("Maximum number of ratings to return"),
    }),
    handler: async (
      params: { user_id: number; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{
          data: {
            rating: number;
            review_text?: string;
            rated_at: string;
            rater?: { name: string };
          }[];
        }>(`/api/users/${params.user_id}/ratings`, {
          per_page: params.limit,
        });

        const ratings = response.data || [];

        if (ratings.length === 0) {
          return `No ratings found for user #${params.user_id}.`;
        }

        const formatted = ratings.map((r, i) => {
          return `${i + 1}. ${"★".repeat(Math.round(r.rating))}${"☆".repeat(5 - Math.round(r.rating))} (${r.rating}/5)
   ${r.review_text || "No review text"}
   By: ${r.rater?.name || "Anonymous"} - ${new Date(r.rated_at).toLocaleDateString()}`;
        });

        return `**Ratings for User #${params.user_id}:**\n\n${formatted.join("\n\n")}`;
      } catch (error) {
        return `Error fetching ratings: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_carrier_profile",
    description:
      "Get a carrier's public profile including their business info, vehicle details, and ratings.",
    schema: z.object({
      carrier_id: z.number().describe("The carrier's user ID"),
    }),
    handler: async (
      params: { carrier_id: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{
          data: User & {
            carrier_profile?: {
              business_name?: string;
              vehicle_type?: string;
              bio?: string;
            };
            completed_deliveries?: number;
          };
        }>(`/api/carriers/${params.carrier_id}`);

        const carrier = response.data;
        const profile = carrier.carrier_profile;

        const lines = [
          `**Carrier: ${carrier.name}**`,
          carrier.rating ? `Rating: ${carrier.rating}★ (${carrier.total_ratings || 0} reviews)` : "No ratings yet",
          carrier.verification_level ? `Verification: ${carrier.verification_level}` : null,
          "",
          profile?.business_name ? `Business: ${profile.business_name}` : null,
          profile?.vehicle_type ? `Vehicle: ${profile.vehicle_type}` : null,
          profile?.bio ? `\nBio: ${profile.bio}` : null,
          "",
          carrier.completed_deliveries !== undefined
            ? `Completed deliveries: ${carrier.completed_deliveries}`
            : null,
        ];

        return lines.filter(Boolean).join("\n");
      } catch (error) {
        return `Error fetching carrier profile: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];
