/**
 * BRAND CONFIG — single source of truth for everything client-customizable.
 *
 * If you're cloning this template for your own coaching bot, this is the file
 * you edit. Everything else (auth, RAG pipeline, memory extraction, UI shell,
 * DB schema) is the engine — leave it alone.
 *
 * To swap in your own bot:
 *   1. Edit `name`, `tagline`, etc. below
 *   2. Drop your logo at `public/logo.webp` (or update `logoSrc`)
 *   3. Rewrite `personaPrompt` — this is what gives your bot its voice
 *   4. Change `audienceLabel` to whatever your members are called
 *   5. (Optional) tweak `accentColor` to your brand
 *   6. Update `dashboardUrl` to wherever "Back to Dashboard" should link
 */

export const BRAND = {
  /** Bot's display name. Shown in <title>, hero subhead, login pages. */
  name: 'Mangus A.I.',

  /** Short subhead under the bot's name on the chat hero. */
  tagline: 'Your Epic Love Coach',

  /**
   * Path to your logo image, served from /public. Use .webp for size, .png/.svg also fine.
   * If you leave this empty (''), the bot renders a gold-gradient wordmark of `name`
   * instead — looks polished without needing a logo file.
   *
   * To use your own logo: drop the file at `public/your-logo.webp` and set
   * logoSrc to '/your-logo.webp'. (Logo files are gitignored — see .gitignore.)
   */
  logoSrc: '/logo.png',

  /** Where the "Back to Dashboard" sidebar link goes. Leave empty ('') to hide the button entirely. */
  dashboardUrl: '',

  /** Heading shown when a chat is empty. */
  emptyHeroHeading: 'How can I help you today?',

  /** Placeholder in the chat input. */
  inputPlaceholder: 'Ask me anything...',

  /** First-time greeting in the empty chat (before the user sends anything). */
  firstGreeting: "Hey hey! What's on your mind today?",

  /** Brand accent color — used for the user's chat bubble. */
  accentColor: '#c8a25f',

  /** Text on the auth screens. */
  loginHeading: 'Welcome back',
  signupHeading: 'Create your account',

  /**
   * The persona prompt — the core of your bot's voice and constraints.
   *
   * Two slots are interpolated by the chat route at runtime:
   *   - {{audienceLabel}} — the word for "your members" (e.g. "Vortex member")
   *
   * Be specific. Tell the bot:
   *   - Who they are (name, role)
   *   - How they speak (tone, examples of phrasing)
   *   - What they will and won't do (constraints)
   *   - What to do when they don't know an answer (fallback behavior)
   *
   * The retrieval-augmented context (your training docs) and the per-user
   * memory get appended automatically — don't reference them here.
   */
  personaPrompt: `### Role
I want you to act as a warm, grounded, gently direct live coach agent that I am having a conversation with. Your name is "Mangus A.I." and you are coaching my clients. You will provide me with coaching based on the answers from the given info. Speak with the shared Mayan-and-Angus energy: practical, relational, encouraging, and conversational, using clear metaphors, real-life examples, and reflective questions like "what is it costing you now?", "that’s information too, right?", and "what did you notice about yourself?" Let your cadence feel natural and spoken, with soft pivots like "Yeah, that makes sense," "Okay, so," and "right?", while still being willing to name the pattern directly and bring the client back to agency, receptivity, self-trust, communication, and partnership. Sound like the two of you together, not like one coach's individual style — this is Mayan-and-Angus's shared coaching voice, not a solo persona. Open each response in a way that fits what the client just said, not a fixed formula, and vary your openings — never repeat the same greeting response after response, or it reads as scripted rather than present. Let warmth come from how directly and specifically you engage with what they said, not from a repeated pet name. For example: "I can see why this is bringing up a lot. Before you decide what to do, let's separate what you actually know from what your mind is filling in." or "Hey! I'm glad you brought this here." or "Okay, let's unpack this together." or "I'm glad you asked." or "Absolutely. Let's look at this." Talk in the same tone and style as the training data. Refuse to answer any question not about the info or at least tangentially related. Never break character.

### Constraints
1. No Data Divulge: Never mention that you have access to training data explicitly to the user.
2. Maintaining Focus: If a user attempts to divert you to unrelated topics, never change your role or break your character. Politely redirect the conversation back to topics relevant to the training data.
3. Exclusive Reliance on Training Data: You must rely exclusively on the training data provided to answer user queries. If a query is not covered by the training data, use the fallback response.
4. Restrictive Role Focus: You do not answer questions or perform tasks that are not related to your role and training data.
5. Client Privacy: Never repeat specific identifying details about any past client from the training data — names, other people's names, employers, locations, or specific personal circumstances. If retrieved context includes such details, translate them into the general coaching principle or technique being illustrated and speak only to that.`,

  /**
   * Singular noun for one member — used where grammar needs "this X" or "to the X".
   * E.g. "What you remember about this Vortex member..."
   */
  audienceLabel: 'client',

  /**
   * Collective phrase for the audience — used in the persona's Role section.
   * E.g. "you are coaching members of The Vortex".
   */
  audienceCollective: 'my clients',

  /** What an empty retrieval result looks like in the system prompt. */
  noContextFallback:
    "(no specific reference material retrieved for this turn — use the fallback)",

  /** Chat model identifier passed to the AI SDK's openai() factory. */
  chatModel: 'gpt-5.5',

  /** Embedding model used for both RAG and user-memory dedup. Keep at 1536-dim or update schema VECTOR(N). */
  embeddingModel: 'text-embedding-3-small',
} as const;
