'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';

export function ForgotPasswordCard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

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
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, margin: '0 0 8px' }}>
          Reset your password
        </h1>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#666', margin: '0 0 24px' }}>
          {sent
            ? "Check your email for a link to reset your password."
            : "Enter your email and we'll send you a link to reset your password."}
        </p>

        {!sent && (
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
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
            {error && <div style={{ color: '#c43657', fontSize: 14, lineHeight: 1.4 }}>{error}</div>}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                padding: '12px 16px',
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                borderRadius: 12,
                background: loading || !email.trim() ? '#e5e5e5' : '#111',
                color: '#fff',
                cursor: loading ? 'wait' : 'pointer',
                marginTop: 4,
              }}
            >
              {loading ? '...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 16 }}>
          <Link href="/login" style={{ color: '#111', fontWeight: 500 }}>
            ← Back to sign in
          </Link>
        </div>
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
