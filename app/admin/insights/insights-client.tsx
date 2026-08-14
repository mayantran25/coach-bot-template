'use client';

import { useState } from 'react';

export function InsightsClient() {
  const [report, setReport] = useState<string | null>(null);
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ since: since || undefined, until: until || undefined }),
      });
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
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label style={labelStyle}>From</label>
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            disabled={loading}
            style={dateInputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>To</label>
          <input
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            disabled={loading}
            style={dateInputStyle}
          />
        </div>
        {(since || until) && (
          <button
            onClick={() => {
              setSince('');
              setUntil('');
            }}
            disabled={loading}
            style={{
              padding: '9px 12px',
              fontSize: 13,
              color: '#666',
              background: 'transparent',
              border: '1px solid #ddd',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

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
              Based on {sampleSize} user message{sampleSize === 1 ? '' : 's'}
              {since || until ? (
                <>
                  {' '}
                  {since && `from ${since}`} {until && `to ${until}`}
                </>
              ) : (
                ' (most recent).'
              )}
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
};

const dateInputStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 13,
  border: '1px solid #ddd',
  borderRadius: 8,
};
