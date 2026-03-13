// src/app/api/instructor-apply/route.ts
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { instructorSchema } from '@/lib/validations'
import { ok, err, formatZodError, getIp, applyRateLimit, isSpam } from '@/lib/api'
import { sendInstructorNotification, sendInstructorConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, 'instructor-apply')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (isSpam(body)) {
    return ok({ message: 'Application received.' }, 201)
  }

  let data
  try {
    data = instructorSchema.parse(body)
  } catch (e) {
    if (e instanceof ZodError) return err('Validation failed', 422, formatZodError(e))
    return err('Invalid request', 400)
  }

  // Check for existing application with this email
  const existing = await prisma.instructorApplication.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    // Don't reveal the duplicate — just tell them we have it
    return ok({
      message: 'We already have an application on file for this email. Our team will be in touch.',
    }, 200)
  }

  const application = await prisma.instructorApplication.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      expertiseArea: data.expertiseArea,
      yearsOfExperience: data.yearsOfExperience,
      linkedinUrl: data.linkedinUrl || null,
      proposal: data.proposal,
      ipAddress: getIp(req),
    },
  })

  Promise.allSettled([
    sendInstructorNotification({ ...data, id: application.id }),
    sendInstructorConfirmation(data),
  ]).catch(console.error)

  return ok({
    message: 'Application received! We\'ll review and get back to you within 5 business days.',
    ref: application.id.slice(-8).toUpperCase(),
  }, 201)
}
