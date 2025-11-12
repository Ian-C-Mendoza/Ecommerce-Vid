import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ✅ Keeps the user logged in even after refresh
    autoRefreshToken: true, // ✅ Automatically refresh expired tokens
    detectSessionInUrl: true, // ✅ Handles redirects for OAuth
  },
});
