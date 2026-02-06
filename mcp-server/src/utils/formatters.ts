/**
 * Response formatters for MCP tool outputs
 * Formats API responses into human-readable text for Claude
 */

export interface Trip {
  id: number;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  departure_date: string;
  arrival_date?: string;
  available_weight_kg: number;
  available_space_liters?: number;
  price_per_kg?: number;
  flat_trip_price?: number;
  transportation_method: string;
  trip_status: string;
  carrier?: {
    id: number;
    name: string;
    rating?: number;
  };
}

export interface Package {
  id: number;
  pickup_city: string;
  pickup_country?: string;
  delivery_city: string;
  delivery_country?: string;
  package_name: string;
  package_weight_kg: number;
  package_value?: number;
  fragile: boolean;
  urgency_level: string;
  max_price_budget?: number;
  pickup_date_preferred?: string;
  delivery_date_needed?: string;
  request_status: string;
  shipper?: {
    id: number;
    name: string;
  };
}

export interface Match {
  id: number;
  agreed_price: number;
  match_status: string;
  initiated_by?: string;
  carrier_message?: string;
  shipper_message?: string;
  confirmed_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  carrier_trip?: Trip;
  package_request?: Package;
  carrier?: {
    id: number;
    name: string;
    email?: string;
    rating?: number;
  };
  shipper?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phone_verified?: boolean;
  verification_level?: string;
  user_types?: string[];
  rating?: number;
  total_ratings?: number;
  is_active_carrier?: boolean;
  is_active_shipper?: boolean;
  created_at?: string;
}

export interface Stats {
  trips?: {
    total_trips: number;
    active_trips: number;
    completed_trips: number;
    success_rate?: number;
  };
  packages?: {
    total_requests: number;
    delivered_packages: number;
    in_transit?: number;
    success_rate?: number;
  };
  earnings?: {
    total_earnings: number;
    monthly_earnings?: number;
    average_per_delivery?: number;
  };
  spending?: {
    total_spent: number;
    monthly_spending?: number;
    average_per_package?: number;
  };
  ratings?: {
    average_rating: number;
    total_ratings: number;
  };
}

/**
 * Format a trip for display
 */
export function formatTrip(trip: Trip): string {
  const lines = [
    `**Trip #${trip.id}**`,
    `Route: ${trip.origin_city} → ${trip.destination_city}`,
    `Departure: ${formatDate(trip.departure_date)}`,
    trip.arrival_date ? `Arrival: ${formatDate(trip.arrival_date)}` : null,
    `Available: ${trip.available_weight_kg} kg`,
    trip.available_space_liters ? `Space: ${trip.available_space_liters} L` : null,
    `Transport: ${trip.transportation_method}`,
    trip.price_per_kg ? `Price: $${trip.price_per_kg}/kg` : null,
    trip.flat_trip_price ? `Flat Price: $${trip.flat_trip_price}` : null,
    `Status: ${formatStatus(trip.trip_status)}`,
    trip.carrier ? `Carrier: ${trip.carrier.name}${trip.carrier.rating ? ` (${trip.carrier.rating}★)` : ""}` : null,
  ];

  return lines.filter(Boolean).join("\n");
}

/**
 * Format a list of trips
 */
export function formatTrips(trips: Trip[]): string {
  if (trips.length === 0) {
    return "No trips found matching your criteria.";
  }

  const header = `Found ${trips.length} trip(s):\n`;
  const formatted = trips.map((trip, index) => {
    return `${index + 1}. **${trip.origin_city} → ${trip.destination_city}** (Trip #${trip.id})
   📅 ${formatDate(trip.departure_date)} | 📦 ${trip.available_weight_kg}kg | ${trip.transportation_method}
   ${trip.price_per_kg ? `💰 $${trip.price_per_kg}/kg` : trip.flat_trip_price ? `💰 $${trip.flat_trip_price} flat` : ""}
   Status: ${formatStatus(trip.trip_status)}`;
  });

  return header + formatted.join("\n\n");
}

/**
 * Format a package for display
 */
export function formatPackage(pkg: Package): string {
  const lines = [
    `**Package #${pkg.id}**: ${pkg.package_name}`,
    `Route: ${pkg.pickup_city} → ${pkg.delivery_city}`,
    `Weight: ${pkg.package_weight_kg} kg`,
    pkg.package_value ? `Value: $${pkg.package_value}` : null,
    `Fragile: ${pkg.fragile ? "Yes ⚠️" : "No"}`,
    `Urgency: ${pkg.urgency_level}`,
    pkg.max_price_budget ? `Budget: $${pkg.max_price_budget}` : null,
    pkg.pickup_date_preferred ? `Pickup: ${formatDate(pkg.pickup_date_preferred)}` : null,
    pkg.delivery_date_needed ? `Deliver by: ${formatDate(pkg.delivery_date_needed)}` : null,
    `Status: ${formatStatus(pkg.request_status)}`,
    pkg.shipper ? `Shipper: ${pkg.shipper.name}` : null,
  ];

  return lines.filter(Boolean).join("\n");
}

/**
 * Format a list of packages
 */
export function formatPackages(packages: Package[]): string {
  if (packages.length === 0) {
    return "No packages found matching your criteria.";
  }

  const header = `Found ${packages.length} package(s):\n`;
  const formatted = packages.map((pkg, index) => {
    return `${index + 1}. **${pkg.package_name}** (Package #${pkg.id})
   📍 ${pkg.pickup_city} → ${pkg.delivery_city} | ⚖️ ${pkg.package_weight_kg}kg
   ${pkg.fragile ? "⚠️ Fragile | " : ""}Urgency: ${pkg.urgency_level}
   ${pkg.max_price_budget ? `💰 Budget: $${pkg.max_price_budget}` : ""}
   Status: ${formatStatus(pkg.request_status)}`;
  });

  return header + formatted.join("\n\n");
}

/**
 * Format a match for display
 */
export function formatMatch(match: Match): string {
  const lines = [
    `**Match #${match.id}**`,
    `Status: ${formatStatus(match.match_status)}`,
    `Agreed Price: $${match.agreed_price}`,
    match.initiated_by ? `Initiated by: ${match.initiated_by}` : null,
    "",
    "**Carrier:**",
    match.carrier ? `  ${match.carrier.name} (ID: ${match.carrier.id})${match.carrier.rating ? ` - ${match.carrier.rating}★` : ""}` : "  Not available",
    match.carrier?.email ? `  Email: ${match.carrier.email}` : null,
    "",
    "**Shipper:**",
    match.shipper ? `  ${match.shipper.name} (ID: ${match.shipper.id})` : "  Not available",
    match.shipper?.email ? `  Email: ${match.shipper.email}` : null,
    "",
    match.carrier_trip ? "**Trip:**" : null,
    match.carrier_trip ? `  ${match.carrier_trip.origin_city} → ${match.carrier_trip.destination_city}` : null,
    match.carrier_trip ? `  Departure: ${formatDate(match.carrier_trip.departure_date)}` : null,
    "",
    match.package_request ? "**Package:**" : null,
    match.package_request ? `  ${match.package_request.package_name} - ${match.package_request.package_weight_kg}kg` : null,
    "",
    "**Timeline:**",
    match.confirmed_at ? `  Confirmed: ${formatDate(match.confirmed_at)}` : null,
    match.picked_up_at ? `  Picked up: ${formatDate(match.picked_up_at)}` : null,
    match.delivered_at ? `  Delivered: ${formatDate(match.delivered_at)}` : null,
  ];

  return lines.filter(Boolean).join("\n");
}

/**
 * Format a list of matches
 */
export function formatMatches(matches: Match[]): string {
  if (matches.length === 0) {
    return "No matches found.";
  }

  const header = `Found ${matches.length} match(es):\n`;
  const formatted = matches.map((match, index) => {
    const route = match.carrier_trip
      ? `${match.carrier_trip.origin_city} → ${match.carrier_trip.destination_city}`
      : "Route not available";
    const pkg = match.package_request?.package_name || "Package not available";

    return `${index + 1}. **Match #${match.id}** - ${formatStatus(match.match_status)}
   📦 ${pkg} | 🚗 ${route}
   💰 $${match.agreed_price}
   Carrier: ${match.carrier?.name || "N/A"} | Shipper: ${match.shipper?.name || "N/A"}`;
  });

  return header + formatted.join("\n\n");
}

/**
 * Format a user profile
 */
export function formatUser(user: User): string {
  const roles = user.user_types?.join(", ") || "None";
  const lines = [
    `**User #${user.id}**: ${user.name}`,
    `Email: ${user.email}`,
    user.phone ? `Phone: ${user.phone} ${user.phone_verified ? "✓" : "(unverified)"}` : null,
    `Roles: ${roles}`,
    user.verification_level ? `Verification: ${user.verification_level}` : null,
    user.rating ? `Rating: ${user.rating}★ (${user.total_ratings || 0} reviews)` : null,
    user.is_active_carrier !== undefined ? `Active Carrier: ${user.is_active_carrier ? "Yes" : "No"}` : null,
    user.is_active_shipper !== undefined ? `Active Shipper: ${user.is_active_shipper ? "Yes" : "No"}` : null,
    user.created_at ? `Member since: ${formatDate(user.created_at)}` : null,
  ];

  return lines.filter(Boolean).join("\n");
}

/**
 * Format statistics
 */
export function formatStats(stats: Stats, type: "carrier" | "shipper" | "platform"): string {
  const lines: string[] = [];

  if (type === "carrier" && stats.trips) {
    lines.push("**Trip Statistics:**");
    lines.push(`  Total trips: ${stats.trips.total_trips}`);
    lines.push(`  Active: ${stats.trips.active_trips}`);
    lines.push(`  Completed: ${stats.trips.completed_trips}`);
    if (stats.trips.success_rate) {
      lines.push(`  Success rate: ${stats.trips.success_rate}%`);
    }
  }

  if (type === "shipper" && stats.packages) {
    lines.push("**Package Statistics:**");
    lines.push(`  Total requests: ${stats.packages.total_requests}`);
    lines.push(`  Delivered: ${stats.packages.delivered_packages}`);
    if (stats.packages.in_transit) {
      lines.push(`  In transit: ${stats.packages.in_transit}`);
    }
    if (stats.packages.success_rate) {
      lines.push(`  Success rate: ${stats.packages.success_rate}%`);
    }
  }

  if (stats.earnings) {
    lines.push("");
    lines.push("**Earnings:**");
    lines.push(`  Total: $${stats.earnings.total_earnings.toFixed(2)}`);
    if (stats.earnings.monthly_earnings) {
      lines.push(`  This month: $${stats.earnings.monthly_earnings.toFixed(2)}`);
    }
    if (stats.earnings.average_per_delivery) {
      lines.push(`  Avg per delivery: $${stats.earnings.average_per_delivery.toFixed(2)}`);
    }
  }

  if (stats.spending) {
    lines.push("");
    lines.push("**Spending:**");
    lines.push(`  Total: $${stats.spending.total_spent.toFixed(2)}`);
    if (stats.spending.monthly_spending) {
      lines.push(`  This month: $${stats.spending.monthly_spending.toFixed(2)}`);
    }
    if (stats.spending.average_per_package) {
      lines.push(`  Avg per package: $${stats.spending.average_per_package.toFixed(2)}`);
    }
  }

  if (stats.ratings) {
    lines.push("");
    lines.push("**Ratings:**");
    lines.push(`  Average: ${stats.ratings.average_rating}★`);
    lines.push(`  Total reviews: ${stats.ratings.total_ratings}`);
  }

  return lines.join("\n");
}

/**
 * Format a date string
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a status string
 */
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: "🟢 Active",
    planning: "📋 Planning",
    in_transit: "🚚 In Transit",
    completed: "✅ Completed",
    cancelled: "❌ Cancelled",
    open: "🟢 Open",
    matched: "🤝 Matched",
    delivered: "✅ Delivered",
    carrier_requested: "📨 Carrier Requested",
    shipper_requested: "📨 Shipper Requested",
    shipper_accepted: "✅ Shipper Accepted",
    carrier_accepted: "✅ Carrier Accepted",
    confirmed: "🤝 Confirmed",
    picked_up: "📦 Picked Up",
    pending: "⏳ Pending",
  };

  return statusMap[status.toLowerCase()] || status;
}
