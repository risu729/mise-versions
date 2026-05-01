import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { getMigrationStatus } from "../../../../src/migrations";
import { jsonResponse, requireApiAuth } from "../../lib/api";

import { env } from "cloudflare:workers";
// GET /api/migrations - Database migration status (admin)
export const GET: APIRoute = async ({ request, locals }) => {
  const authError = requireApiAuth(request, env.API_SECRET);
  if (authError) return authError;

  const db = drizzle(env.DB);
  const migrationStatus = await getMigrationStatus(db);

  return jsonResponse(migrationStatus);
};
