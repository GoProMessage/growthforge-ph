import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? "";

/** True only when real credentials have been provided */
export const isSupabaseReady =
  supabaseUrl.startsWith("https://") &&
  supabaseKey.length > 20 &&
  !supabaseUrl.includes("your_project");

/** Lazy singleton — only instantiated when real credentials exist */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseReady) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env.local"
    );
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}
