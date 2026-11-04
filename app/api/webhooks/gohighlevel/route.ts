import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSignupCode } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Different lengths already tell a timing attacker something, but there's
  // nothing secret-dependent left to leak once we bail out here — the real
  // protection is comparing the matching-length case in constant time.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Called by a GoHighLevel workflow (e.g. "tag added: paid" or "order paid")
 * as a webhook action. Mints a one-time invite code for the client and
 * returns it so the GHL workflow can map it into a follow-up "Send Email"
 * step — GHL sends the actual email using your existing setup, this just
 * generates the code.
 *
 * Configure in GHL: Workflow → add step → "Webhook" →
 *   URL: https://<your-domain>/api/webhooks/gohighlevel?secret=<GHL_WEBHOOK_SECRET>
 *   Method: POST
 *   Body (JSON): { "email": "{{contact.email}}", "name": "{{contact.first_name}} {{contact.last_name}}" }
 * Then map the response's `code` field into a custom value, and use it in
 * an email step alongside the `signupUrl` field.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`ghl-webhook:${ip}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  if (!process.env.GHL_WEBHOOK_SECRET || !safeEqual(secret ?? '', process.env.GHL_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';

  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  const label = name ? `${name} <${email}>` : email;
  const code = await createSignupCode(label);

  return NextResponse.json({
    code,
    signupUrl: `${url.origin}/signup`,
    email,
  });
}
