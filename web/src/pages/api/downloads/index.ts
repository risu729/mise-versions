import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { setupAnalytics } from "../../../../../src/analytics";
import { env } from "cloudflare:workers";
import {
  cachedJsonResponse,
  errorResponse,
  CACHE_CONTROL,
} from "../../../lib/api";

// GET /api/downloads - Get aggregate download stats (public)
export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = drizzle(env.ANALYTICS_DB);
    const analytics = setupAnalytics(db);

    const stats = await analytics.getTopTools(20);

    return cachedJsonResponse(stats, CACHE_CONTROL.API);
  } catch (error) {
    console.error("Get all downloads error:", error);
    return errorResponse("Failed to get download stats", 500);
  }
};
