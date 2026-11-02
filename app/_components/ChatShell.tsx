'use client';

import { useState, type ReactNode } from 'react';
import type { ChatListItem } from '@/lib/db';
import { Sidebar } from './Sidebar';

export function ChatShell({
  chats,
  email,
  isAdmin,
  children,
}: {
  chats: ChatListItem[];
  email: string | null;
  isAdmin?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      {/* No stylesheet in this app — a scoped <style> tag is the simplest way to
          get a real @media breakpoint without inline styles fighting it. */}
      <style>{`
        .cb-sidebar {
          width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
          border-right: 1px solid #ececec;
        }
        .cb-backdrop { display: none; }
        .cb-menu-btn { display: none; }
        .cb-sidebar-close { display: none; }

        @media (max-width: 768px) {
          .cb-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 85vw;
            max-width: 300px;
            border-right: none;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            z-index: 60;
            box-shadow: 2px 0 16px rgba(0,0,0,0.12);
          }
          .cb-sidebar.cb-sidebar-open {
            transform: translateX(0);
          }
          .cb-backdrop.cb-backdrop-open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.35);
            z-index: 55;
          }
          .cb-menu-btn {
            display: inline-flex;
          }
          .cb-sidebar-close {
            display: inline-flex;
          }
        }
      `}</style>

      <button
        type="button"
        className="cb-menu-btn"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          top: 14,
          left: 14,
          zIndex: 70,
          width: 38,
          height: 38,
          borderRadius: 10,
          border: '1px solid #e0e0e0',
          background: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <MenuIcon />
      </button>

      <div
        className={`cb-backdrop ${open ? 'cb-backdrop-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <Sidebar chats={chats} email={email} isAdmin={isAdmin} open={open} onClose={() => setOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>{children}</div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
