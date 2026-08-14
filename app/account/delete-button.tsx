'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function DeleteAccountButton() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      // The account (and its session) is gone server-side; clear the local
      // session too, then send them home — middleware will redirect to /login.
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  const canDelete = confirmText.trim().toUpperCase() === 'DELETE';

  return (
    <div
      style={{
        border: '1px solid #f0c4cf',
        background: '#fff6f7',
        borderRadius: 12,
        padding: 20,
        maxWidth: 480,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#a6334a', margin: '0 0 8px' }}>
        Delete my account
      </h2>
      <p style={{ fontSize: 14, color: '#7a3040', lineHeight: 1.5, margin: '0 0 16px' }}>
        This permanently deletes your account, every chat, and everything remembered about
        you. This cannot be undone.
      </p>
      <label style={{ display: 'block', fontSize: 13, color: '#7a3040', marginBottom: 6 }}>
        Type <strong>DELETE</strong> to confirm
      </label>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 14,
          border: '1px solid #e0b8c0',
          borderRadius: 8,
          marginBottom: 12,
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <div style={{ color: '#a6334a', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}
      <button
        onClick={onDelete}
        disabled={!canDelete || loading}
        style={{
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          borderRadius: 8,
          background: canDelete && !loading ? '#c43657' : '#e5c3cb',
          color: '#fff',
          cursor: canDelete && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Deleting…' : 'Permanently delete my account'}
      </button>
    </div>
  );
}
