import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { DeleteAccountButton } from './delete-button';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#666' }}>
        ← Back to chat
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '12px 0 4px' }}>Account</h1>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 28px' }}>{user.email}</p>

      <DeleteAccountButton />
    </div>
  );
}
