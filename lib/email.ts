// src/lib/email.ts
// Email service using Resend — all notification + confirmation templates

import { Resend } from 'resend'
import type { EnrollmentInput, WaitlistInput, InstructorInput, ContactInput } from './validations'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.FROM_EMAIL ?? 'Tween Learning <noreply@tweenlearning.com>'
const TEAM = process.env.NOTIFICATION_EMAIL ?? 'hello@tweentechnologies.com'

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const brandHeader = (title: string) => `
  <div style="background:#042E4D;padding:28px 32px 20px;border-radius:10px 10px 0 0">
    <div style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#EFEFEF;letter-spacing:-0.5px">
      twn. <span style="font-size:13px;font-weight:400;opacity:0.5;letter-spacing:1px">LEARNING</span>
    </div>
    <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#5ec8ff;margin-top:8px">${title}</div>
  </div>`

const brandFooter = () => `
  <div style="background:#021C32;padding:20px 32px;border-radius:0 0 10px 10px;text-align:center">
    <p style="font-family:Arial,sans-serif;font-size:12px;color:rgba(239,239,239,0.35);margin:0">
      Tween Technologies · Accra, Ghana · 
      <a href="https://linktr.ee/tween_technologies" style="color:#0082D4;text-decoration:none">linktr.ee/tween_technologies</a>
    </p>
  </div>`

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#042E4D;width:180px;vertical-align:top">${label}</td>
    <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;vertical-align:top">${value}</td>
  </tr>`

const wrapper = (inner: string) => `
  <div style="max-width:600px;margin:0 auto;background:#f8f7f3;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,77,0.12)">
    ${inner}
  </div>`

// ─── ENROLLMENT: TEAM NOTIFICATION ────────────────────────────────────────────
export async function sendEnrollmentNotification(
  data: EnrollmentInput & { id: string; programTitle: string }
) {
  const html = wrapper(`
    ${brandHeader('🎓 New Enrollment Application')}
    <div style="padding:28px 32px;background:#fff">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 20px">
        A new student has applied to enroll on <strong>${data.programTitle}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #042E4D">
        ${row('Reference', `#${data.id.slice(-8).toUpperCase()}`)}
        ${row('Full Name', data.fullName)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone ?? 'Not provided')}
        ${row('Country', data.country)}
        ${row('Current Role', data.currentRole)}
        ${row('Experience', data.experienceLevel)}
        ${row('Program', data.programTitle)}
        ${row('Motivation', `<em>${data.motivation}</em>`)}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #0082D4">
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#0082D4;font-weight:700;margin:0 0 4px">ACTION REQUIRED</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#374151;margin:0">
          Review this application and confirm the student within 48 hours.
          Reply to this email or contact <a href="mailto:${data.email}">${data.email}</a>.
        </p>
      </div>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [TEAM],
    subject: `[Enrollment] ${data.fullName} — ${data.programTitle}`,
    html,
    reply_to: data.email,
  })
}

// ─── ENROLLMENT: STUDENT CONFIRMATION ────────────────────────────────────────
export async function sendEnrollmentConfirmation(
  data: EnrollmentInput & { id: string; programTitle: string; cohortDate?: string }
) {
  const html = wrapper(`
    ${brandHeader('✅ Application Received!')}
    <div style="padding:28px 32px;background:#fff">
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#374151;margin:0 0 16px">
        Hi <strong>${data.fullName}</strong>,
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7">
        Thank you for applying to <strong>${data.programTitle}</strong> at Tween Learning.
        We've received your application and our team will review it personally.
      </p>
      <div style="background:#042E4D;border-radius:8px;padding:20px 24px;margin:24px 0">
        <p style="font-family:Arial,sans-serif;font-size:12px;color:rgba(239,239,239,0.6);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px">Your Application</p>
        <p style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#EFEFEF;margin:0 0 4px">${data.programTitle}</p>
        ${data.cohortDate ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#5ec8ff;margin:0">📅 Cohort starts: ${data.cohortDate}</p>` : ''}
        <p style="font-family:Arial,sans-serif;font-size:12px;color:rgba(239,239,239,0.45);margin:8px 0 0">Ref: #${data.id.slice(-8).toUpperCase()}</p>
      </div>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7">
        <strong>What happens next:</strong><br>
        1. Our team reviews your application (within 48 hours)<br>
        2. You'll receive a confirmation email with your cohort details<br>
        3. We'll share onboarding materials before your start date
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0;line-height:1.7">
        Questions? Reply to this email or reach us at 
        <a href="mailto:${TEAM}" style="color:#0082D4">${TEAM}</a>.
      </p>
    </div>
    <div style="padding:20px 32px;background:#f0f9ff;text-align:center">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#374151;margin:0 0 12px">Follow us for updates and community content</p>
      <a href="https://linktr.ee/tween_technologies" 
         style="display:inline-block;background:#0082D4;color:#fff;font-family:Arial,sans-serif;font-size:13px;font-weight:700;padding:10px 24px;border-radius:6px;text-decoration:none">
        Follow Tween Tech →
      </a>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: `Application received — ${data.programTitle} | Tween Learning`,
    html,
    reply_to: TEAM,
  })
}

// ─── WAITLIST: TEAM NOTIFICATION ──────────────────────────────────────────────
export async function sendWaitlistNotification(
  data: WaitlistInput & { id: string }
) {
  const html = wrapper(`
    ${brandHeader('📋 New Waitlist Signup')}
    <div style="padding:28px 32px;background:#fff">
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #042E4D">
        ${row('Name', data.fullName)}
        ${row('Email', data.email)}
        ${row('Interest Area', data.interestArea.replace(/_/g, ' '))}
        ${row('Ref', `#${data.id.slice(-8).toUpperCase()}`)}
      </table>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [TEAM],
    subject: `[Waitlist] ${data.fullName} — ${data.interestArea.replace(/_/g, ' ')}`,
    html,
    reply_to: data.email,
  })
}

// ─── WAITLIST: CONFIRMATION ───────────────────────────────────────────────────
export async function sendWaitlistConfirmation(data: WaitlistInput) {
  const html = wrapper(`
    ${brandHeader('🎉 You\'re on the list!')}
    <div style="padding:28px 32px;background:#fff">
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#374151;margin:0 0 16px">
        Hi <strong>${data.fullName}</strong>,
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7">
        You're now on the Tween Learning waitlist for <strong>${data.interestArea.replace(/_/g, ' ')}</strong>.
        You'll be among the first to know when a new cohort or program launches.
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0;line-height:1.7">
        In the meantime, follow us to stay connected with the community.
      </p>
    </div>
    <div style="padding:20px 32px;background:#f0f9ff;text-align:center">
      <a href="https://linktr.ee/tween_technologies" 
         style="display:inline-block;background:#0082D4;color:#fff;font-family:Arial,sans-serif;font-size:13px;font-weight:700;padding:10px 24px;border-radius:6px;text-decoration:none">
        Follow Tween Tech →
      </a>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: 'You\'re on the Tween Learning waitlist!',
    html,
    reply_to: TEAM,
  })
}

// ─── INSTRUCTOR: TEAM NOTIFICATION ────────────────────────────────────────────
export async function sendInstructorNotification(
  data: InstructorInput & { id: string }
) {
  const html = wrapper(`
    ${brandHeader('🧑‍🏫 New Instructor Application')}
    <div style="padding:28px 32px;background:#fff">
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #042E4D">
        ${row('Name', data.fullName)}
        ${row('Email', data.email)}
        ${row('Expertise', data.expertiseArea)}
        ${row('Years Exp.', String(data.yearsOfExperience))}
        ${row('LinkedIn', data.linkedinUrl ? `<a href="${data.linkedinUrl}">${data.linkedinUrl}</a>` : 'Not provided')}
        ${row('Proposal', `<em>${data.proposal}</em>`)}
        ${row('Ref', `#${data.id.slice(-8).toUpperCase()}`)}
      </table>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [TEAM],
    subject: `[Instructor] ${data.fullName} — ${data.expertiseArea}`,
    html,
    reply_to: data.email,
  })
}

// ─── INSTRUCTOR: CONFIRMATION ─────────────────────────────────────────────────
export async function sendInstructorConfirmation(data: InstructorInput) {
  const html = wrapper(`
    ${brandHeader('🙌 Application Received!')}
    <div style="padding:28px 32px;background:#fff">
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#374151;margin:0 0 16px">
        Hi <strong>${data.fullName}</strong>,
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7">
        Thank you for applying to teach at Tween Learning. We've received your proposal 
        for <strong>${data.expertiseArea}</strong> and our team will review it within 5 business days.
      </p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0">
        We'll reach out to schedule a brief conversation if your profile is a good fit.
      </p>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: 'Instructor application received — Tween Learning',
    html,
    reply_to: TEAM,
  })
}

// ─── CONTACT: TEAM NOTIFICATION ───────────────────────────────────────────────
export async function sendContactNotification(
  data: ContactInput & { id: string }
) {
  const html = wrapper(`
    ${brandHeader('📨 New Contact Message')}
    <div style="padding:28px 32px;background:#fff">
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #042E4D">
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Subject', data.subject ?? '(none)')}
        ${row('Message', `<em>${data.message}</em>`)}
        ${row('Ref', `#${data.id.slice(-8).toUpperCase()}`)}
      </table>
    </div>
    ${brandFooter()}
  `)

  return resend.emails.send({
    from: FROM,
    to: [TEAM],
    subject: `[Contact] ${data.subject ?? data.name} — Tween Learning`,
    html,
    reply_to: data.email,
  })
}
