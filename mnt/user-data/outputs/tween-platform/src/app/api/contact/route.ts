// src/app/api/contact/route.ts
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { ok, err, formatZodError, getIp, applyRateLimit, isSpam } from '@/lib/api'
import { sendContactNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, 'contact')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (isSpam(body)) {
    return ok({ message: 'Message sent.' }, 201)
  }

  let data
  try {
    data = contactSchema.parse(body)
  } catch (e) {
    if (e instanceof ZodError) return err('Validation failed', 422, formatZodError(e))
    return err('Invalid request', 400)
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
      ipAddress: getIp(req),
    },
  })

  Promise.allSettled([
    sendContactNotification({ ...data, id: message.id }),
  ]).catch(console.error)

  return ok({ message: 'Message received! We\'ll get back to you soon.' }, 201)
}
