import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-anon-key";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://demo.supabase.co"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
