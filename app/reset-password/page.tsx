import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { ResetPasswordCard } from '@/app/_components/ResetPasswordCard';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  // Only reachable with a valid session — either a normal login, or the
  // temporary recovery session set by /auth/callback after clicking the
  // password-reset email link. No session means no valid/expired link.
  const user = await getUser();
  if (!user) redirect('/forgot-password');

  return <ResetPasswordCard />;
}
