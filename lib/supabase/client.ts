import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client using the anon (public) key.
 * RLS policies apply — only safe for non-sensitive reads.
 */
export const supabase = createClient<Database>(url, anonKey);
