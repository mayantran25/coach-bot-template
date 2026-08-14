import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses RLS entirely — server-only, never
 * import this from client components. Used for admin operations (deleting a
 * user's auth account) where the regular session-bound client can't do the job.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
