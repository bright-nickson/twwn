// src/app/api/waitlist/route.ts
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { waitlistSchema } from '@/lib/validations'
import { ok, err, formatZodError, getIp, applyRateLimit, isSpam } from '@/lib/api'
import { sendWaitlistNotification, sendWaitlistConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, 'waitlist')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (isSpam(body)) {
    return ok({ message: 'You\'re on the list!' }, 201)
  }

  let data
  try {
    data = waitlistSchema.parse(body)
  } catch (e) {
    if (e instanceof ZodError) return err('Validation failed', 422, formatZodError(e))
    return err('Invalid request', 400)
  }

  // Upsert — idempotent: same email + interest = no duplicate error
  const entry = await prisma.waitlistEntry.upsert({
    where: {
      email_interestArea: {
        email: data.email,
        interestArea: data.interestArea,
      },
    },
    update: {
      fullName: data.fullName, // update name in case it changed
    },
    create: {
      fullName: data.fullName,
      email: data.email,
      interestArea: data.interestArea,
      gdprConsent: data.gdprConsent,
      ipAddress: getIp(req),
      source: req.headers.get('referer'),
    },
  })

  Promise.allSettled([
    sendWaitlistNotification({ ...data, id: entry.id }),
    sendWaitlistConfirmation(data),
  ]).catch(console.error)

  return ok({ message: 'You\'re on the waitlist! We\'ll be in touch.', ref: entry.id.slice(-8).toUpperCase() }, 201)
}
