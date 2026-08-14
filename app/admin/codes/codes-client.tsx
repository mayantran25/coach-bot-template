'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GenerateCodeForm() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setNewCode(null);
    setCopied(false);
    try {
      const res = await fetch('/api/admin/signup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate code.');
      setNewCode(data.code);
      setLabel('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!newCode) return;
    await navigator.clipboard.writeText(newCode);
    setCopied(true);
  }

  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>
            Label (optional — e.g. client's name or email, just for your reference)
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={loading}
            placeholder="Jane Doe"
            style={{
              width: '100%',
              padding: '9px 12px',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 8,
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            borderRadius: 8,
            background: loading ? '#e5e5e5' : '#111',
            color: '#fff',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Generating…' : 'Generate invite code'}
        </button>
      </div>

      {error && <div style={{ color: '#c43657', fontSize: 13, marginTop: 12 }}>{error}</div>}

      {newCode && (
        <div
          style={{
            marginTop: 16,
            padding: '14px 16px',
            background: '#f7f5ef',
            border: '1px solid #e5ddc8',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <code style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.05em' }}>{newCode}</code>
          <button
            onClick={copy}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              border: '1px solid #ccc',
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
