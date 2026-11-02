import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { listChats } from '@/lib/db';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { ChatShell } from '@/app/_components/ChatShell';

export const dynamic = 'force-dynamic';

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');
  const chats = await listChats(user.id);
  return (
    <ChatShell chats={chats} email={user.email ?? null} isAdmin={isAdminEmail(user.email)}>
      {children}
    </ChatShell>
  );
}
