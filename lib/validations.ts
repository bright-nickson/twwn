// src/lib/validations.ts
import { z } from 'zod'

// ─── ENROLLMENT ───────────────────────────────────────────────────────────────
export const enrollmentSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name is too long')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name is too long')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  country: z
    .string()
    .min(2, 'Please select your country')
    .max(100),
  background: z
    .string()
    .min(2, 'Please select your background')
    .max(200)
    .trim(),
  programName: z
    .string()
    .min(2, 'Please select a program')
    .max(200)
    .trim(),
})

export type EnrollmentInput = z.infer<typeof enrollmentSchema>

// ─── WAITLIST ─────────────────────────────────────────────────────────────────
const normalizeInterestArea = (raw: unknown) => {
  if (typeof raw !== 'string') return raw

  const value = raw.trim()

  // Already in the correct enum format
  if (['AI', 'CYBERSECURITY', 'SOFTWARE_ENGINEERING', 'CLOUD_COMPUTING', 'OTHER'].includes(value)) {
    return value
  }

  const upper = value.toUpperCase()

  if (upper === 'ARTIFICIAL INTELLIGENCE') return 'AI'
  if (upper === 'CYBERSECURITY') return 'CYBERSECURITY'
  if (upper === 'SOFTWARE ENGINEERING') return 'SOFTWARE_ENGINEERING'
  if (upper === 'CLOUD COMPUTING') return 'CLOUD_COMPUTING'

  return 'OTHER'
}

export const waitlistSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200)
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  interestArea: z.preprocess(
    normalizeInterestArea,
    z.enum(
      ['AI', 'CYBERSECURITY', 'SOFTWARE_ENGINEERING', 'CLOUD_COMPUTING', 'OTHER'],
      { required_error: 'Please select an area of interest' }
    )
  ),
  gdprConsent: z.boolean().default(true),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

// ─── INSTRUCTOR APPLICATION ───────────────────────────────────────────────────
export const instructorSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200)
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  expertiseArea: z
    .string()
    .min(2, 'Please enter your area of expertise')
    .max(200)
    .trim(),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Please enter a valid number' })
    .min(0)
    .max(50),
  linkedinUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  proposal: z
    .string()
    .min(50, 'Please write at least 50 characters describing your teaching approach')
    .max(5000)
    .trim(),
})

export type InstructorInput = z.infer<typeof instructorSchema>

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200)
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .max(200)
    .optional()
    .transform(v => v?.trim() || undefined),
  message: z
    .string()
    .min(10, 'Please write at least 10 characters')
    .max(5000)
    .trim(),
})

export type ContactInput = z.infer<typeof contactSchema>
