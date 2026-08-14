'use client';

import { useState } from 'react';

export function InsightsClient() {
  const [report, setReport] = useState<string | null>(null);
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/insights', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate report.');
      setReport(data.report);
      setSampleSize(data.sampleSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={generate}
        disabled={loading}
        style={{
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          borderRadius: 10,
          background: loading ? '#e5e5e5' : '#111',
          color: '#fff',
          cursor: loading ? 'wait' : 'pointer',
          marginBottom: 20,
        }}
      >
        {loading ? 'Analyzing conversations…' : report ? 'Regenerate report' : 'Generate report'}
      </button>

      {error && <div style={{ color: '#c43657', fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {report && (
        <div>
          {sampleSize !== null && (
            <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
              Based on the {sampleSize} most recent user messages.
            </p>
          )}
          <div
            style={{
              padding: 20,
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              background: '#fff',
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {report}
          </div>
        </div>
      )}
    </div>
  );
}
