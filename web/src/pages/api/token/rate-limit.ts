import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { setupDatabase } from "../../../../../src/database";
import { requireApiAuth, CORS_HEADERS } from "../../../lib/api";

import { env } from "cloudflare:workers";
// POST /api/token/rate-limit - Mark a token as rate-limited
export const POST: APIRoute = async ({ request, locals }) => {
  // Require API auth
  const authError = requireApiAuth(request, env.API_SECRET);
  if (authError) return authError;

  const db = drizzle(env.DB);
  const database = setupDatabase(db);

  const rateLimitData = (await request.json()) as {
    token_id: number;
    reset_at: string;
  };

  await database.markTokenRateLimited(
    rateLimitData.token_id,
    rateLimitData.reset_at,
  );

  return new Response("Token marked as rate-limited", {
    headers: CORS_HEADERS,
  });
};
