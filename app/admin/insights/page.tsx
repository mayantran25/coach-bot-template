import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { InsightsClient } from './insights-client';

export const dynamic = 'force-dynamic';

export default async function AdminInsightsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/admin" style={{ fontSize: 13, color: '#666' }}>
        ← All users
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 4px' }}>Topics & Insights</h1>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px' }}>
        What people are actually asking, summarized from recent conversations.
      </p>
      <InsightsClient />
    </div>
  );
}
