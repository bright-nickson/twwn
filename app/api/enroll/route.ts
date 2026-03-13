// src/app/api/enroll/route.ts
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { enrollmentSchema } from '@/lib/validations'
import { ok, err, formatZodError, getIp, applyRateLimit, isSpam } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // 1. Rate limit: max 10 requests per IP per 60s
  const limited = applyRateLimit(req, 'enroll')
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
    return ok({ message: 'Application received.' }, 201)
  }

  // 3. Validate input
  let data
  try {
    data = enrollmentSchema.parse(body)
  } catch (e) {
    if (e instanceof ZodError) {
      return err('Validation failed', 422, formatZodError(e))
    }
    return err('Invalid request', 400)
  }

  try {
    // 4. Find matching program in DB
    const program = await prisma.program.findFirst({
      where: { title: data.programName },
    })

    if (!program) {
      return err('Selected program is not available.', 400)
    }

    // 5. Check for duplicate active enrollment for this program
    const existing = await prisma.enrollment.findFirst({
      where: {
        email: data.email,
        programId: program.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existing) {
      return err(
        'An application with this email already exists.',
        409
      )
    }

    // 6. Create enrollment record in Supabase (PostgreSQL)
    const enrollment = await prisma.enrollment.create({
      data: {
        programId: program.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        background: data.background,
        programName: data.programName,
        ipAddress: getIp(req),
        userAgent: req.headers.get('user-agent') ?? undefined,
        source: req.headers.get('referer') ?? undefined,
      },
    })

    // 7. Log enrollment
    console.log('Enrollment saved to database:', {
      id: enrollment.id,
      firstName: enrollment.firstName,
      lastName: enrollment.lastName,
      email: enrollment.email,
      country: enrollment.country,
      background: enrollment.background,
      programName: enrollment.programName,
      timestamp: new Date().toISOString(),
    })

    // 8. Return success
    return ok(
      {
        message: 'Application received! Check your email for confirmation.',
        ref: enrollment.id.slice(-8).toUpperCase(),
      },
      201
    )
  } catch (e) {
    console.error('Error saving enrollment to database:', e)
    return err('Something went wrong while saving your application. Please try again.', 500)
  }
}
