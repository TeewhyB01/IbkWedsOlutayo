type Attempt = {
  count: number;
  expiresAt: number;
};

const attempts = new Map<string, Attempt>();

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.expiresAt < now) {
    attempts.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  attempts.set(key, current);
  return true;
}
