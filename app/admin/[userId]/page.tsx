import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { listChats, getUserEmailForAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const admin = await getUser();
  if (!admin) redirect('/login');
  if (!isAdminEmail(admin.email)) redirect('/');

  const { userId } = await params;
  const email = await getUserEmailForAdmin(userId);
  if (!email) notFound();

  const chats = await listChats(userId, 200);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/admin" style={{ fontSize: 13, color: '#666' }}>
        ← All users
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 4px' }}>{email}</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        {chats.length} chat{chats.length === 1 ? '' : 's'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {chats.map((c) => (
          <Link
            key={c.id}
            href={`/admin/${userId}/${c.id}`}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              color: '#111',
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {c.title}
            </span>
            <span style={{ color: '#999', flexShrink: 0 }}>
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </Link>
        ))}
        {chats.length === 0 && (
          <div style={{ color: '#999', fontSize: 14, fontStyle: 'italic' }}>No chats yet.</div>
        )}
      </div>
    </div>
  );
}
