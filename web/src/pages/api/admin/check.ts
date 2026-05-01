import type { APIRoute } from "astro";
import { getAuthCookie } from "../../../lib/auth";
import { jsonResponse } from "../../../lib/api";
import { isAdmin } from "../../../lib/admin";

import { env } from "cloudflare:workers";
// GET /api/admin/check - Check if current user is admin
export const GET: APIRoute = async ({ request, locals }) => {
  const auth = await getAuthCookie(request, env.API_SECRET);

  return jsonResponse({
    isAdmin: auth ? isAdmin(auth.username) : false,
  });
};
