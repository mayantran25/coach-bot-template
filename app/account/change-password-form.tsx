'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PasswordField } from '@/app/_components/PasswordField';

export function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(false);
    if (password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('New passwords don’t match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();

      // Re-verify identity with the current password before changing it.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('Could not verify your account. Try signing in again.');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInError) throw new Error('Current password is incorrect.');

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess(true);
      setCurrent('');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = current.length > 0 && password.length >= 6 && confirm.length >= 6 && !loading;

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        padding: 20,
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Change password</h2>
      <PasswordField
        placeholder="Current password"
        autoComplete="current-password"
        required
        value={current}
        onChange={setCurrent}
        disabled={loading}
        style={inputStyle}
      />
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
      {error && <div style={{ color: '#c43657', fontSize: 13 }}>{error}</div>}
      {success && <div style={{ color: '#0a6e3f', fontSize: 13 }}>Password updated.</div>}
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          borderRadius: 8,
          background: canSubmit ? '#111' : '#e5e5e5',
          color: '#fff',
          cursor: loading ? 'wait' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? '...' : 'Update password'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 14,
  border: '1px solid #ddd',
  borderRadius: 8,
  outline: 'none',
  background: '#fff',
};
