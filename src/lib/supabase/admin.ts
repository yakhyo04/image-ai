import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client. Bypasses RLS, so it can write the protected
// `credits` column and the webhook bookkeeping tables. This is used ONLY by
// the Polar webhook (a server-to-server call with no user session) — never
// expose the service role key to the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for the admin client.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
