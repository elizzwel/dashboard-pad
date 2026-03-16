import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { withRole } from "@/lib/auth/middleware";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

const updateUserSchema = z.object({
  nama: z.string().min(1).max(100).optional(),
  role: z.enum(["super_admin", "admin", "operator", "viewer"]).optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

type Params = { id: string };

export const PUT = withRole("super_admin")(
  async (req, { user, params }) => {
    const db = createServerClient();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { id } = await (params as unknown as Promise<Params>);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { password, ...rest } = parsed.data;
    const updates: Record<string, unknown> = { ...rest };
    if (password) {
      updates.password = await hashPassword(password);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await db
      .from("users")
      .update(updates as Database["public"]["Tables"]["users"]["Update"])
      .eq("id", id)
      .select("id, username, nama, role, is_active, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await db.from("audit_logs").insert({
      user_id: user.sub,
      action: "UPDATE_USER",
      resource: "user",
      resource_id: id,
      detail: { fields: Object.keys(updates) },
      ip_address: ip,
    });

    return NextResponse.json({ user: data });
  }
);

export const DELETE = withRole("super_admin")(
  async (req, { user, params }) => {
    const db = createServerClient();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { id } = await (params as unknown as Promise<Params>);

    // Prevent self-deletion
    if (id === user.sub) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      );
    }

    // Soft delete — deactivate instead of hard delete
    const { error } = await db
      .from("users")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revoke all refresh tokens for deactivated user
    await db
      .from("refresh_tokens")
      .update({ is_revoked: true })
      .eq("user_id", id);

    await db.from("audit_logs").insert({
      user_id: user.sub,
      action: "DELETE_USER",
      resource: "user",
      resource_id: id,
      ip_address: ip,
    });

    return NextResponse.json({ success: true });
  }
);
