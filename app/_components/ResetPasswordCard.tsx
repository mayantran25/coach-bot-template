'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';
import { PasswordField } from './PasswordField';

export function ResetPasswordCard() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords don’t match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = password.length >= 6 && confirm.length >= 6 && !loading;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        {BRAND.logoSrc && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={BRAND.logoSrc}
            alt={BRAND.name}
            style={{ width: 'min(460px, 100%)', height: 'auto', display: 'block', margin: '0 auto 24px' }}
          />
        )}
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, margin: '0 0 24px' }}>
          Choose a new password
        </h1>

        <form
          onSubmit={onSubmit}
          style={{
            background: '#fff',
            border: '1px solid #d8d8d8',
            borderRadius: 18,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <PasswordField
            placeholder="New password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={setPassword}
            disabled={loading}
            style={inputStyle}
          />
          <PasswordField
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={setConfirm}
            disabled={loading}
            style={inputStyle}
          />
          {error && <div style={{ color: '#c43657', fontSize: 14, lineHeight: 1.4 }}>{error}</div>}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: '12px 16px',
              fontSize: 15,
              fontWeight: 500,
              border: 'none',
              borderRadius: 12,
              background: canSubmit ? '#111' : '#e5e5e5',
              color: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? '...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: 15,
  border: '1px solid #ddd',
  borderRadius: 10,
  outline: 'none',
  background: '#fff',
};
