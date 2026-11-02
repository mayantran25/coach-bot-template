'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ChatListItem } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';

export function Sidebar({
  chats,
  email,
  isAdmin,
  open,
  onClose,
}: {
  chats: ChatListItem[];
  email: string | null;
  isAdmin?: boolean;
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : null;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside
      className={`cb-sidebar ${open ? 'cb-sidebar-open' : ''}`}
      style={{
        background: '#fafafa',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <button
        type="button"
        className="cb-sidebar-close"
        aria-label="Close menu"
        onClick={onClose}
        style={{
          alignSelf: 'flex-end',
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          background: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <CloseIcon />
      </button>

      {BRAND.logoSrc && (
        <Link href="/" style={{ display: 'block', padding: '4px 12px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND.logoSrc}
            alt={BRAND.name}
            style={{ width: '100%', maxWidth: 230, height: 'auto', display: 'block' }}
          />
        </Link>
      )}

      <Link
        href="/"
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          fontSize: 15,
          fontWeight: 500,
          color: '#111',
          textDecoration: 'none',
          borderRadius: 10,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '1.5px solid #111',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          +
        </span>
        New chat
      </Link>

      {BRAND.dashboardUrl && (
        <a
          href={BRAND.dashboardUrl}
          style={{
            display: 'block',
            padding: '10px 14px',
            textAlign: 'center',
            fontSize: 14,
            color: '#111',
            textDecoration: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            background: '#fff',
          }}
        >
          Back to Dashboard
        </a>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.08em',
            color: '#999',
            padding: '8px 12px 4px',
            textTransform: 'uppercase',
          }}
        >
          Recent Chats
        </div>
        {chats.length === 0 && (
          <div style={{ padding: '8px 12px', fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>
            No chats yet
          </div>
        )}
        {chats.map((c) => {
          const isActive = c.id === activeId;
          return (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              title={c.title}
              onClick={onClose}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                color: isActive ? '#111' : '#444',
                textDecoration: 'none',
                background: isActive ? '#f0eee8' : 'transparent',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {c.title}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          borderTop: '1px solid #ececec',
          paddingTop: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {email && (
          <div
            style={{
              padding: '4px 12px',
              fontSize: 12,
              color: '#888',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={email}
          >
            {email}
          </div>
        )}
        {isAdmin && (
          <Link
            href="/admin"
            style={{
              padding: '8px 12px',
              fontSize: 13,
              color: '#666',
              textDecoration: 'none',
              borderRadius: 8,
            }}
          >
            Admin
          </Link>
        )}
        <Link
          href="/account"
          style={{
            padding: '8px 12px',
            fontSize: 13,
            color: '#666',
            textDecoration: 'none',
            borderRadius: 8,
          }}
        >
          Account
        </Link>
        <button
          onClick={signOut}
          style={{
            padding: '8px 12px',
            fontSize: 13,
            color: '#666',
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 8,
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
