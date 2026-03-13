// src/app/api/waitlist/route.ts
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { waitlistSchema } from '@/lib/validations'
import { ok, err, formatZodError, getIp, applyRateLimit, isSpam } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // 1. Rate limit: max 10 requests per IP per 60s
  const limited = applyRateLimit(req, 'waitlist')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  // 2. Honeypot spam check
  if (isSpam(body)) {
    // Silently succeed — don't tell bots they were caught
    return ok({ message: 'Waitlist entry received.' }, 201)
  }

  // 3. Validate input
  let data
  try {
    data = waitlistSchema.parse(body)
  } catch (e) {
    if (e instanceof ZodError) {
      return err('Validation failed', 422, formatZodError(e))
    }
    return err('Invalid request', 400)
  }

  try {
    // 4. Check for existing waitlist entry for this email + interest area
    const existing = await prisma.waitlistEntry.findFirst({
      where: {
        email: data.email,
        interestArea: data.interestArea,
      },
    })

    if (existing) {
      return err('You are already on the waitlist for this area.', 409)
    }

    // 5. Create waitlist entry in Supabase (Postgres via Prisma)
    const entry = await prisma.waitlistEntry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        interestArea: data.interestArea,
        gdprConsent: data.gdprConsent ?? true,
        ipAddress: getIp(req) ?? undefined,
        source: req.headers.get('referer') ?? undefined,
      },
    })

    // 6. Log entry
    console.log('Waitlist entry saved to database:', {
      id: entry.id,
      fullName: entry.fullName,
      email: entry.email,
      interestArea: entry.interestArea,
      timestamp: new Date().toISOString(),
    })

    // 7. Return success
    return ok(
      {
        message: 'You have been added to the waitlist!',
        ref: entry.id.slice(-8).toUpperCase(),
      },
      201
    )
  } catch (e) {
    console.error('Error saving waitlist entry to database:', e)
    return err('Something went wrong while saving your waitlist entry. Please try again.', 500)
  }
}
