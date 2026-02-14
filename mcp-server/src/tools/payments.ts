/**
 * Payment-related MCP tools
 */

import { z } from "zod";
import { ApiClient } from "../utils/api-client.js";

interface Transaction {
  id: number;
  shipper_id: number;
  carrier_id: number;
  delivery_match_id: number;
  total_amount: number;
  platform_fee: number;
  carrier_amount: number;
  tip_amount?: number;
  tax_amount?: number;
  status: string;
  payout_status?: string;
  created_at: string;
  updated_at: string;
  shipper?: {
    id: number;
    name: string;
    email: string;
  };
  carrier?: {
    id: number;
    name: string;
    email: string;
  };
}

export const paymentTools = [
  {
    name: "list_transactions",
    description:
      "List payment transactions for the authenticated user. Shows all payments made or received.",
    schema: z.object({
      status: z
        .enum(["pending", "authorized", "captured", "completed", "refunded", "failed"])
        .optional()
        .describe("Filter by transaction status"),
      limit: z.number().default(10).describe("Maximum number of results"),
    }),
    handler: async (
      params: { status?: string; limit?: number },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{ data: Transaction[] | { data: Transaction[] } }>("/api/payments", {
          status: params.status,
          per_page: params.limit,
        });

        const transactions = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        if (transactions.length === 0) {
          return "No transactions found.";
        }

        const formatted = transactions.map((t, i) => {
          return `${i + 1}. **Transaction #${t.id}** - ${formatTransactionStatus(t.status)}
   Amount: $${t.total_amount.toFixed(2)}
   Platform fee: $${t.platform_fee.toFixed(2)}
   Carrier receives: $${t.carrier_amount.toFixed(2)}
   ${t.tip_amount ? `Tip: $${t.tip_amount.toFixed(2)}` : ""}
   Match #${t.delivery_match_id}
   Date: ${new Date(t.created_at).toLocaleDateString()}`;
        });

        return `**Your Transactions:**\n\n${formatted.join("\n\n")}`;
      } catch (error) {
        return `Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_transaction",
    description:
      "Get detailed information about a specific transaction. Can look up by transaction ID or match ID.",
    schema: z.object({
      transaction_id: z.number().optional().describe("The transaction ID"),
      match_id: z.number().optional().describe("The match ID to find transaction for"),
    }),
    handler: async (
      params: { transaction_id?: number; match_id?: number },
      client: ApiClient
    ): Promise<string> => {
      if (!params.transaction_id && !params.match_id) {
        return "Please provide either a transaction_id or match_id.";
      }

      try {
        let transaction: Transaction;

        if (params.transaction_id) {
          const response = await client.get<{ data: Transaction }>(
            `/api/payments/${params.transaction_id}`
          );
          transaction = response.data;
        } else {
          const response = await client.get<{ data: Transaction }>(
            `/api/matches/${params.match_id}/transaction`
          );
          transaction = response.data;
        }

        const lines = [
          `**Transaction #${transaction.id}**`,
          `Status: ${formatTransactionStatus(transaction.status)}`,
          "",
          "**Amounts:**",
          `  Total: $${transaction.total_amount.toFixed(2)}`,
          `  Platform fee: $${transaction.platform_fee.toFixed(2)}`,
          `  Carrier receives: $${transaction.carrier_amount.toFixed(2)}`,
          transaction.tip_amount ? `  Tip: $${transaction.tip_amount.toFixed(2)}` : null,
          transaction.tax_amount ? `  Tax: $${transaction.tax_amount.toFixed(2)}` : null,
          "",
          "**Participants:**",
          transaction.shipper
            ? `  Shipper: ${transaction.shipper.name} (${transaction.shipper.email})`
            : null,
          transaction.carrier
            ? `  Carrier: ${transaction.carrier.name} (${transaction.carrier.email})`
            : null,
          "",
          `Match ID: ${transaction.delivery_match_id}`,
          transaction.payout_status ? `Payout status: ${transaction.payout_status}` : null,
          `Created: ${new Date(transaction.created_at).toLocaleString()}`,
          `Updated: ${new Date(transaction.updated_at).toLocaleString()}`,
        ];

        return lines.filter(Boolean).join("\n");
      } catch (error) {
        return `Error fetching transaction: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_earnings_summary",
    description:
      "Get earnings summary for a carrier. Shows total earnings, pending payouts, and breakdown by period.",
    schema: z.object({
      period: z
        .enum(["week", "month", "year", "all"])
        .default("month")
        .describe("Time period for earnings summary"),
    }),
    handler: async (
      params: { period: string },
      client: ApiClient
    ): Promise<string> => {
      try {
        // Get carrier stats which include earnings
        const response = await client.get<{
          data: {
            earnings?: {
              total_earnings: number;
              pending_earnings?: number;
              monthly_earnings?: number;
              average_per_delivery?: number;
            };
            trips?: {
              completed_trips: number;
            };
          };
        }>("/api/carrier/stats");

        const stats = response.data;

        if (!stats.earnings) {
          return "No earnings data available. Complete deliveries to start earning!";
        }

        const lines = [
          `**Earnings Summary (${params.period}):**`,
          "",
          `💰 Total earnings: $${stats.earnings.total_earnings.toFixed(2)}`,
          stats.earnings.monthly_earnings !== undefined
            ? `📅 This month: $${stats.earnings.monthly_earnings.toFixed(2)}`
            : null,
          stats.earnings.pending_earnings !== undefined
            ? `⏳ Pending payout: $${stats.earnings.pending_earnings.toFixed(2)}`
            : null,
          stats.earnings.average_per_delivery !== undefined
            ? `📊 Average per delivery: $${stats.earnings.average_per_delivery.toFixed(2)}`
            : null,
          "",
          stats.trips?.completed_trips !== undefined
            ? `✅ Completed deliveries: ${stats.trips.completed_trips}`
            : null,
        ];

        return lines.filter(Boolean).join("\n");
      } catch (error) {
        return `Error fetching earnings: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
  {
    name: "get_spending_summary",
    description:
      "Get spending summary for a shipper. Shows total spent on deliveries and breakdown by period.",
    schema: z.object({
      period: z
        .enum(["week", "month", "year", "all"])
        .default("month")
        .describe("Time period for spending summary"),
    }),
    handler: async (
      params: { period: string },
      client: ApiClient
    ): Promise<string> => {
      try {
        const response = await client.get<{
          data: {
            spending?: {
              total_spent: number;
              monthly_spending?: number;
              average_per_package?: number;
            };
            packages?: {
              delivered_packages: number;
            };
          };
        }>("/api/shipper/stats");

        const stats = response.data;

        if (!stats.spending) {
          return "No spending data available. Ship packages to see your spending summary!";
        }

        const lines = [
          `**Spending Summary (${params.period}):**`,
          "",
          `💳 Total spent: $${stats.spending.total_spent.toFixed(2)}`,
          stats.spending.monthly_spending !== undefined
            ? `📅 This month: $${stats.spending.monthly_spending.toFixed(2)}`
            : null,
          stats.spending.average_per_package !== undefined
            ? `📊 Average per package: $${stats.spending.average_per_package.toFixed(2)}`
            : null,
          "",
          stats.packages?.delivered_packages !== undefined
            ? `📦 Packages delivered: ${stats.packages.delivered_packages}`
            : null,
        ];

        return lines.filter(Boolean).join("\n");
      } catch (error) {
        return `Error fetching spending: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  },
];

function formatTransactionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "⏳ Pending",
    authorized: "🔐 Authorized",
    captured: "💳 Captured",
    completed: "✅ Completed",
    refunded: "↩️ Refunded",
    failed: "❌ Failed",
  };

  return statusMap[status.toLowerCase()] || status;
}
