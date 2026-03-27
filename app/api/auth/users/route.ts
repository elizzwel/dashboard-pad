import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withRole } from "@/lib/auth/middleware";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

type UserRow = { id: string; username: string; nama: string; role: string; is_active: boolean; created_at: string };

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  nama: z.string().min(1).max(100),
  role: z.enum(["super_admin", "admin", "operator", "viewer"]),
});

export const GET = withRole("super_admin")(async (_req) => {
  const db = createServerClient();
  const { data, error } = await db
    .from("users")
    .select("id, username, nama, role, is_active, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
});

export const POST = withRole("super_admin")(async (req, { user }) => {
  const db = createServerClient();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { username, password, nama, role } = parsed.data;
  const hashed = await hashPassword(password);

  const { data: newUserRaw, error } = await db
    .from("users")
    .insert({ username, password: hashed, nama, role } as never)
    .select("id, username, nama, role, is_active, created_at")
    .single();
  const newUser = newUserRaw as UserRow | null;

  if (error) {
    const isDuplicate = error.code === "23505";
    return NextResponse.json(
      { error: isDuplicate ? "Username sudah digunakan" : error.message },
      { status: isDuplicate ? 409 : 500 }
    );
  }

  await db.from("audit_logs").insert({
    user_id: user.sub,
    action: "CREATE_USER",
    resource: "user",
    resource_id: newUser?.id,
    detail: { username, role },
    ip_address: ip,
  } as never);

  return NextResponse.json({ user: newUser }, { status: 201 });
});
