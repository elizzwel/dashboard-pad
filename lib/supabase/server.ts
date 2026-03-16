import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-side Supabase client using the service role key.
 * Bypasses Row Level Security — use ONLY in API routes (server-side).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
