import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { getUserEmailForAdmin, loadChatForAdmin } from '@/lib/db';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ userId: string; chatId: string }>;
}) {
  const admin = await getUser();
  if (!admin) redirect('/login');
  if (!isAdminEmail(admin.email)) redirect('/');

  const { userId, chatId } = await params;
  const email = await getUserEmailForAdmin(userId);
  if (!email) notFound();

  const messages = await loadChatForAdmin(chatId);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <Link href={`/admin/${userId}`} style={{ fontSize: 13, color: '#666' }}>
        ← {email}
      </Link>
      <p style={{ color: '#999', fontSize: 12, margin: '8px 0 24px' }}>
        Read-only — visible to admins only.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m) => {
          const text = m.parts
            .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join('');
          const hasFiles = m.parts.some((p) => p.type === 'file');
          return (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#999',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {m.role === 'user' ? email : BRAND.name}
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  fontSize: 14,
                  borderRadius: 12,
                  background: m.role === 'user' ? BRAND.accentColor : '#fff',
                  color: m.role === 'user' ? '#fff' : '#111',
                  border: m.role === 'user' ? 'none' : '1px solid #ececec',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {text || (hasFiles ? '[attachment]' : '')}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div style={{ color: '#999', fontSize: 14, fontStyle: 'italic' }}>No messages.</div>
        )}
      </div>
    </div>
  );
}
