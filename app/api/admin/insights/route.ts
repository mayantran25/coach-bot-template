import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUser } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { listRecentUserMessagesForAdmin } from '@/lib/db';
import { BRAND } from '@/lib/brand';

export async function POST() {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const messages = await listRecentUserMessagesForAdmin(300);
  if (messages.length === 0) {
    return NextResponse.json({
      report: 'No user messages yet — check back once people have started chatting.',
      sampleSize: 0,
    });
  }

  const sample = messages
    .map((m, i) => `${i + 1}. ${m.slice(0, 500)}`)
    .join('\n');

  const { text } = await generateText({
    model: openai(BRAND.chatModel),
    system: `You are a research analyst summarizing what users are asking an AI coaching bot called "${BRAND.name}". You'll be given a numbered list of real user messages. Identify the recurring topics, themes, and questions.

Return plain text (no markdown headers, no code fences) in this shape:
- A short list of 4-8 recurring themes, each as "THEME NAME — one-sentence description", followed by 1-2 short quoted example messages that illustrate it.
- End with a one-paragraph summary of what people seem to want most and any notable gaps (things people ask about that the bot likely can't answer well, if any pattern suggests that).

Be concrete and specific to what's actually in the messages — don't generalize or invent themes that aren't supported by the samples.`,
    prompt: `Here are ${messages.length} recent user messages:\n\n${sample}`,
  });

  return NextResponse.json({ report: text.trim(), sampleSize: messages.length });
}
