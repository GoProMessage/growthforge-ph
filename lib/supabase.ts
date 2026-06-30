import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL ?? ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? ""

export const isSupabaseReady =
  supabaseUrl.startsWith("https://") &&
  supabaseKey.length > 20 &&
  !supabaseUrl.includes("your_project")

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseReady) {
    throw new Error("Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_KEY")
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  }
  return _client
}
