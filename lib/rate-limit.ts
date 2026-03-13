// src/lib/rate-limit.ts
// In-memory rate limiter. For multi-instance production, replace with Upstash Redis.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '10', 10)
const WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW ?? '60', 10) * 1000 // ms

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  store.forEach((entry, key) => {
    if (now > entry.resetAt) keysToDelete.push(key)
  })
  keysToDelete.forEach(key => store.delete(key))
}, 5 * 60 * 1000)

export function checkRateLimit(key: string): {
  success: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW })
    return { success: true, remaining: MAX - 1, resetAt: now + WINDOW }
  }

  if (entry.count >= MAX) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  return { success: true, remaining: MAX - entry.count, resetAt: entry.resetAt }
}

// Get a stable key: IP + endpoint
export function getRateLimitKey(ip: string | null, endpoint: string): string {
  return `${ip ?? 'unknown'}:${endpoint}`
}
