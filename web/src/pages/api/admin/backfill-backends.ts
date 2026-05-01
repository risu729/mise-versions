import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { setupAnalytics } from "../../../../../src/analytics";
import { jsonResponse, errorResponse } from "../../../lib/api";

import { env } from "cloudflare:workers";
// POST /api/admin/backfill-backends - Backfill backend_id using registry data (requires auth)
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Verify admin secret
    const authHeader = request.headers.get("Authorization");
    const expectedAuth = `Bearer ${env.API_SECRET}`;
    if (authHeader !== expectedAuth) {
      return errorResponse("Unauthorized", 401);
    }

    const body = (await request.json()) as {
      registry: Array<{ short: string; backends: string[] }>;
    };

    if (!body.registry || !Array.isArray(body.registry)) {
      return errorResponse("Missing or invalid registry data", 400);
    }

    const db = drizzle(env.ANALYTICS_DB);
    const analytics = setupAnalytics(db);

    // Pass D1 directly for raw operations
    const result = await analytics.backfillBackends(
      body.registry,
      env.ANALYTICS_DB,
    );

    return jsonResponse({
      success: true,
      updated: result.updated,
      tools_mapped: result.tools_mapped,
      backends_created: result.backends_created,
    });
  } catch (error) {
    console.error("Backfill error:", error);
    return errorResponse(`Failed to backfill backends: ${error}`, 500);
  }
};
