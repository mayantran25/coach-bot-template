import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Supabase auth redirects here after a magic link / password-reset link is
 * clicked, carrying a `code` query param. We exchange it for a session
 * (setting the session cookies), then send the user on to `next`.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Missing/invalid code — send them back to login with an explanation.
  const url = new URL('/login', origin);
  url.searchParams.set('error', 'auth-link-invalid');
  return NextResponse.redirect(url);
}
