import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Deletes the current user's own account and all associated data.
 * Uses the Supabase Admin API (not raw SQL) so auth-internal state — sessions,
 * refresh tokens, identities — is cleaned up correctly, not just app tables.
 * chats/messages/user_memory cascade-delete via their FK to auth.users(id).
 */
export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
