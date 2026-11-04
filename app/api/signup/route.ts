import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { reserveSignupCode, finalizeSignupCode, releaseSignupCode } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Invite-code-gated signup. Creates the account server-side via the Admin
 * API so the code can be atomically reserved first — the client never calls
 * supabase.auth.signUp() directly for this flow. On success, the client
 * signs itself in normally with the same email/password.
 */
export async function POST(req: Request) {
  // Throttle invite-code guessing: 8 attempts per 10 minutes per IP.
  const ip = getClientIp(req);
  if (!rateLimit(`signup:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (!email || !password || !code) {
    return NextResponse.json({ error: 'Email, password, and invite code are required.' }, { status: 400 });
  }

  const codeId = await reserveSignupCode(code);
  if (!codeId) {
    return NextResponse.json({ error: 'That invite code is invalid or has already been used.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // the invite code is the verification step here
  });

  if (error || !data.user) {
    await releaseSignupCode(codeId);
    return NextResponse.json({ error: error?.message ?? 'Could not create account.' }, { status: 400 });
  }

  await finalizeSignupCode(codeId, data.user.id);

  return NextResponse.json({ ok: true });
}
