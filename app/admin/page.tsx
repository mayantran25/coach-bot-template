import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { listAllUsersForAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/');

  const users = await listAllUsersForAdmin();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Admin</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 28 }}>
        {users.length} user{users.length === 1 ? '' : 's'} · visible only to {process.env.ADMIN_EMAILS}
      </p>

      <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#fafafa', textAlign: 'left' }}>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Signed up</th>
              <th style={thStyle}>Chats</th>
              <th style={thStyle}>Messages</th>
              <th style={thStyle}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>
                  <Link href={`/admin/${u.id}`} style={{ color: '#111', fontWeight: 500 }}>
                    {u.email}
                  </Link>
                </td>
                <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>{u.chatCount}</td>
                <td style={tdStyle}>{u.messageCount}</td>
                <td style={tdStyle}>
                  {u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={5}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/" style={{ fontSize: 13, color: '#666' }}>
          ← Back to chat
        </Link>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 14px', fontWeight: 600, color: '#444' };
const tdStyle: React.CSSProperties = { padding: '10px 14px', color: '#333' };
