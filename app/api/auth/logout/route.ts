import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const db = createServerClient();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const refreshToken = req.cookies.get("refresh_token")?.value;

  const response = NextResponse.json({ success: true });
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

      // Revoke refresh token in DB
      await db
        .from("refresh_tokens")
        .update({ is_revoked: true })
        .eq("user_id", payload.sub!)
        .eq("token_hash", tokenHash);

      // Audit log
      await db.from("audit_logs").insert({
        user_id: payload.sub!,
        action: "LOGOUT",
        ip_address: ip,
      });
    } catch {
      // Token invalid — still clear cookies, just skip DB update
    }
  }

  return response;
}
