import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { setupAnalytics } from "../../../../../src/analytics";

import { env } from "cloudflare:workers";
export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = drizzle(env.ANALYTICS_DB);
    const analytics = setupAnalytics(db);

    const stats = await analytics.getGrowthMetrics();

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Get growth error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get growth metrics" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
