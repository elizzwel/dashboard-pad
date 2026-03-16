import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { createHash } from "crypto";
import type { Role } from "@/lib/auth/roles";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  const db = createServerClient();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const oldRefreshToken = req.cookies.get("refresh_token")?.value;
  if (!oldRefreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  let payload;
  try {
    payload = await verifyRefreshToken(oldRefreshToken);
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const oldHash = createHash("sha256").update(oldRefreshToken).digest("hex");

  // Check it exists and is not revoked
  const { data: storedToken } = await db
    .from("refresh_tokens")
    .select("id, is_revoked")
    .eq("user_id", payload.sub!)
    .eq("token_hash", oldHash)
    .single();

  if (!storedToken || storedToken.is_revoked) {
    return NextResponse.json({ error: "Token revoked" }, { status: 401 });
  }

  // Revoke old token (one-time use)
  await db
    .from("refresh_tokens")
    .update({ is_revoked: true })
    .eq("id", storedToken.id);

  // Fetch fresh user data
  const { data: user } = await db
    .from("users")
    .select("id, username, nama, role, is_active")
    .eq("id", payload.sub!)
    .single();

  if (!user || !user.is_active) {
    return NextResponse.json({ error: "User not found or inactive" }, { status: 401 });
  }

  // Issue new tokens
  const newAccessToken = await signAccessToken({
    sub: user.id,
    username: user.username,
    role: user.role as Role,
    nama: user.nama,
  });
  const newRefreshToken = await signRefreshToken(user.id);

  // Store new refresh token
  const newHash = createHash("sha256").update(newRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.from("refresh_tokens").insert({
    user_id: user.id,
    token_hash: newHash,
    expires_at: expiresAt,
    ip_address: ip,
    user_agent: req.headers.get("user-agent"),
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", newAccessToken, {
    ...cookieBase,
    maxAge: 15 * 60,
  });
  response.cookies.set("refresh_token", newRefreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
