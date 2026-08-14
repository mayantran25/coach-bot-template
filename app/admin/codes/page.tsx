import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { listSignupCodesForAdmin } from '@/lib/db';
import { GenerateCodeForm } from './codes-client';

export const dynamic = 'force-dynamic';

export default async function AdminCodesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/');

  const codes = await listSignupCodesForAdmin();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/admin" style={{ fontSize: 13, color: '#666' }}>
        ← All users
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 4px' }}>Invite Codes</h1>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 20px' }}>
        Generate a one-time code, email it to a paying client, and they use it to create their
        account. Each code works exactly once.
      </p>

      <GenerateCodeForm />

      <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#fafafa', textAlign: 'left' }}>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Label</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{c.code}</td>
                <td style={tdStyle}>{c.label ?? '—'}</td>
                <td style={tdStyle}>
                  {c.usedBy ? (
                    <span style={{ color: '#0a6e3f' }}>
                      Used {c.usedAt && new Date(c.usedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span style={{ color: '#999' }}>Unused</span>
                  )}
                </td>
                <td style={tdStyle}>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  No codes generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 14px', fontWeight: 600, color: '#444' };
const tdStyle: React.CSSProperties = { padding: '10px 14px', color: '#333' };
