import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { createSignupCode } from '@/lib/db';

export async function POST(req: Request) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const label = typeof body?.label === 'string' && body.label.trim() ? body.label.trim() : undefined;
  const code = await createSignupCode(label);
  return NextResponse.json({ code });
}
