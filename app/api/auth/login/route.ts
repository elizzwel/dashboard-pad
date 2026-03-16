import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { createHash } from "crypto";
import type { Role } from "@/lib/auth/roles";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MINUTES = 15;

export async function POST(req: NextRequest) {
  const db = createServerClient();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username dan password wajib diisi" },
      { status: 400 }
    );
  }

  // Rate limit: check recent failed attempts from this IP
  const windowStart = new Date(
    Date.now() - RATE_WINDOW_MINUTES * 60 * 1000
  ).toISOString();
  const { count } = await db
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("success", false)
    .gte("attempted_at", windowStart);

  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit." },
      { status: 429 }
    );
  }

  // Look up user
  const { data: user } = await db
    .from("users")
    .select("id, username, password, nama, role, is_active")
    .eq("username", username)
    .single();

  const loginSuccess =
    user && user.is_active && (await comparePassword(password, user.password));

  console.log('loginSuccess', loginSuccess);
  console.log('user', user);
  console.log('password', password);
  console.log('username', username);
  
  // Log attempt regardless of result
  await db.from("login_attempts").insert({
    ip_address: ip,
    username,
    success: Boolean(loginSuccess),
  });

  if (!loginSuccess) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    );
  }

  // Issue tokens
  const accessToken = await signAccessToken({
    sub: user.id,
    username: user.username,
    role: user.role as Role,
    nama: user.nama,
  });
  const refreshToken = await signRefreshToken(user.id);

  // Store hashed refresh token
  const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.from("refresh_tokens").insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    ip_address: ip,
    user_agent: req.headers.get("user-agent"),
  });

  // Audit log
  await db.from("audit_logs").insert({
    user_id: user.id,
    action: "LOGIN",
    ip_address: ip,
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
    },
  });

  response.cookies.set("access_token", accessToken, {
    ...cookieBase,
    maxAge: 15 * 60,
  });
  response.cookies.set("refresh_token", refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
