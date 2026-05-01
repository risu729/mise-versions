import type { APIRoute } from "astro";
import { getAuthCookie } from "../../../lib/auth";

import { env } from "cloudflare:workers";
// GET /api/auth/me - Check current login state
export const GET: APIRoute = async ({ request, locals }) => {
  const auth = await getAuthCookie(request, env.API_SECRET);

  const response = auth
    ? { authenticated: true, username: auth.username }
    : { authenticated: false };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
