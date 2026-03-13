// src/lib/api.ts
// Shared helpers for all API route handlers

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { checkRateLimit, getRateLimitKey } from './rate-limit'

// ─── RESPONSE HELPERS ─────────────────────────────────────────────────────────
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function err(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status })
}

// ─── PARSE + VALIDATE ─────────────────────────────────────────────────────────
export function formatZodError(e: ZodError) {
  return e.errors.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path.join('.')
    acc[key] = issue.message
    return acc
  }, {})
}

// ─── IP EXTRACTION ────────────────────────────────────────────────────────────
export function getIp(req: NextRequest): string | null {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  )
}

// ─── RATE LIMIT MIDDLEWARE ────────────────────────────────────────────────────
export function applyRateLimit(req: NextRequest, endpoint: string) {
  const ip = getIp(req)
  const key = getRateLimitKey(ip, endpoint)
  const result = checkRateLimit(key)

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  return null // null = not rate limited, proceed
}

// ─── SPAM HONEYPOT CHECK ──────────────────────────────────────────────────────
// If the honeypot field "website" is filled, it's a bot
export function isSpam(body: Record<string, unknown>): boolean {
  return typeof body.website === 'string' && body.website.trim().length > 0
}
