import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { canAccessRoute } from "@/lib/auth/roles";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/_next",
  "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload["role"] as string;

    // Role-based route access check
    if (!canAccessRoute(role as Parameters<typeof canAccessRoute>[0], pathname)) {
      return redirectToLogin(request);
    }

    // Inject user info into request headers for Server Components
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.sub ?? "");
    headers.set("x-user-role", role);
    headers.set("x-user-name", (payload["nama"] as string) ?? "");

    return NextResponse.next({ request: { headers } });
  } catch {
    // Access token expired or invalid — redirect to login
    // (silent refresh is handled client-side via the auth store)
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all requests except:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
