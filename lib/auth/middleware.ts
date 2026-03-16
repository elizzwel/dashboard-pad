import { type NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";
import type { Role } from "./roles";

type RouteContext = {
  params: Promise<Record<string, string>>;
};

type AuthContext = RouteContext & {
  user: AccessTokenPayload;
};

type AuthHandler = (
  req: NextRequest,
  ctx: AuthContext
) => Promise<Response> | Response;

type RouteHandler = (
  req: NextRequest,
  ctx: RouteContext
) => Promise<Response> | Response;

function getTokenFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get("access_token")?.value;
}

/**
 * Verifies the access token and injects `user` into the handler context.
 */
export function withAuth(handler: AuthHandler): RouteHandler {
  return async (req, ctx) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const user = await verifyAccessToken(token);
      return handler(req, { ...ctx, user });
    } catch {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}

/**
 * Verifies the access token AND checks that the user's role is in the
 * allowed list. Returns 403 if the role doesn't match.
 */
export function withRole(...roles: Role[]) {
  return (handler: AuthHandler): RouteHandler =>
    withAuth(async (req, ctx) => {
      if (!roles.includes(ctx.user.role)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, ctx);
    });
}

/** Helper to clear auth cookies (used in logout + error paths) */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
