import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { setupDatabase } from "../../../../../src/database";
import { jsonResponse, requireApiAuth } from "../../../lib/api";

import { env } from "cloudflare:workers";
// GET /api/stats - Token statistics (admin)
export const GET: APIRoute = async ({ request, locals }) => {
  const authError = requireApiAuth(request, env.API_SECRET);
  if (authError) return authError;

  const db = drizzle(env.DB);
  const database = setupDatabase(db);
  const stats = await database.getTokenStats();

  return jsonResponse(stats);
};
