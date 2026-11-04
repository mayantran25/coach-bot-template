/**
 * Minimal in-memory, per-instance rate limiter for public API routes.
 *
 * This resets on cold start and isn't shared across concurrent serverless
 * instances, so it's a deterrent against casual scripted abuse — not a hard
 * guarantee. For this app's actual risk (single-use, atomically-reserved
 * invite codes with ~4.3 billion possible values; a secret-gated webhook),
 * that's a reasonable bar without adding an external store/dependency.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

// Periodically forget old buckets so this map can't grow unbounded on a
// long-lived instance.
const MAX_BUCKETS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > MAX_BUCKETS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
