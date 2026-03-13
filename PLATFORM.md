# Tween Learning — Full-Stack Platform
## Production Engineering Guide

> **Status:** Production-ready enrollment platform  
> **Stack:** Next.js 14 · PostgreSQL · Prisma · Resend · Vercel  
> **Purpose:** Capture enrollments, waitlist leads, instructor applications, and contact messages

---

## 1. ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────────────┐
│                        VERCEL (Global CDN + Edge)                     │
│                                                                        │
│  ┌────────────────────────────────┐                                   │
│  │  Static HTML/CSS (Your UI)     │  ← Zero changes to appearance     │
│  │  + /public/tween-forms.js      │  ← Wires forms to API             │
│  └────────────────────────────────┘                                   │
│                  │                                                     │
│                  ▼   (fetch POST)                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              Next.js API Routes (Serverless Functions)        │    │
│  │                                                               │    │
│  │  POST /api/enroll          → validate → DB → email × 2       │    │
│  │  POST /api/waitlist        → validate → DB → email × 2       │    │
│  │  POST /api/instructor-apply→ validate → DB → email × 2       │    │
│  │  POST /api/contact         → validate → DB → email × 1       │    │
│  │                                                               │    │
│  │  Rate limit: 10 req / 60s per IP                             │    │
│  │  Honeypot: bot detection via hidden "website" field           │    │
│  │  Validation: Zod schemas (type-safe, server-side)            │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────┐                  ┌─────────────────────┐
│   SUPABASE      │                  │       RESEND         │
│  PostgreSQL DB  │                  │  Email Delivery API  │
│                 │                  │                      │
│  enrollments    │                  │  Team notification   │
│  waitlist       │                  │  Student confirmation│
│  instructors    │                  │  Branded templates   │
│  contacts       │                  └─────────────────────┘
│  programs       │
│  cohorts        │
└─────────────────┘
```

**Key Design Decisions:**
- The existing HTML/CSS UI is untouched. `tween-forms.js` is a drop-in enhancement.
- API routes are serverless — no server to manage, scales to zero.
- Emails are sent fire-and-forget (non-blocking) — form submission never fails due to email issues.
- Prisma ORM provides type-safe database access and migration management.

---

## 2. PROJECT STRUCTURE

```
tween-learning/
│
├── prisma/
│   ├── schema.prisma          # Database schema (5 models)
│   └── seed.ts                # Seed programs + cohorts
│
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── enroll/route.ts          # POST /api/enroll
│   │       ├── waitlist/route.ts        # POST /api/waitlist
│   │       ├── instructor-apply/route.ts # POST /api/instructor-apply
│   │       └── contact/route.ts         # POST /api/contact
│   │
│   └── lib/
│       ├── prisma.ts          # Singleton Prisma client
│       ├── validations.ts     # Zod schemas for all forms
│       ├── email.ts           # Resend email templates
│       ├── rate-limit.ts      # In-memory rate limiter
│       └── api.ts             # Shared route helpers
│
├── public/
│   └── tween-forms.js         # Drop-in frontend form handler
│
├── .env.example               # Environment variable template
├── next.config.ts             # Security headers + config
└── package.json
```

---

## 3. DATABASE SCHEMA

### `programs`
| Column      | Type     | Notes                             |
|-------------|----------|-----------------------------------|
| id          | CUID PK  |                                   |
| slug        | String   | unique, URL-safe identifier       |
| title       | String   |                                   |
| description | String?  |                                   |
| status      | Enum     | ACTIVE · COMING_SOON · ARCHIVED   |
| createdAt   | DateTime |                                   |
| updatedAt   | DateTime |                                   |

### `cohorts`
| Column    | Type     | Notes                             |
|-----------|----------|-----------------------------------|
| id        | CUID PK  |                                   |
| programId | FK       | → programs.id                    |
| name      | String   | "Cohort 1 — July 2025"           |
| startDate | DateTime |                                   |
| maxSeats  | Int      | default 20                        |
| status    | Enum     | OPEN · FULL · IN_PROGRESS · etc. |

### `enrollments`
| Column          | Type     | Notes                                |
|-----------------|----------|--------------------------------------|
| id              | CUID PK  |                                      |
| programId       | FK       | → programs.id                       |
| cohortId        | FK?      | → cohorts.id (nullable)             |
| fullName        | String   |                                      |
| email           | String   | indexed                              |
| phone           | String?  |                                      |
| country         | String   |                                      |
| currentRole     | String   |                                      |
| experienceLevel | Enum     | BEGINNER · INTERMEDIATE · ADVANCED   |
| motivation      | Text     |                                      |
| status          | Enum     | PENDING · CONFIRMED · REJECTED · etc|
| gdprConsent     | Boolean  |                                      |
| ipAddress       | String?  |                                      |
| userAgent       | String?  |                                      |
| source          | String?  | referrer URL                         |
| createdAt       | DateTime |                                      |

### `waitlist_entries`
| Column       | Type     | Notes                                      |
|--------------|----------|--------------------------------------------|
| id           | CUID PK  |                                            |
| fullName     | String   |                                            |
| email        | String   | unique per interestArea                    |
| interestArea | Enum     | AI · CYBERSECURITY · SOFTWARE_ENGINEERING · CLOUD_COMPUTING · OTHER |
| gdprConsent  | Boolean  |                                            |
| ipAddress    | String?  |                                            |
| createdAt    | DateTime |                                            |

### `instructor_applications`
| Column            | Type     | Notes                              |
|-------------------|----------|------------------------------------|
| id                | CUID PK  |                                    |
| fullName          | String   |                                    |
| email             | String   | unique                             |
| expertiseArea     | String   |                                    |
| yearsOfExperience | Int      |                                    |
| linkedinUrl       | String?  |                                    |
| proposal          | Text     |                                    |
| status            | Enum     | NEW · REVIEWING · ACCEPTED · REJECTED |
| reviewerNotes     | Text?    | Internal notes                     |
| createdAt         | DateTime |                                    |

### `contact_messages`
| Column    | Type     | Notes     |
|-----------|----------|-----------|
| id        | CUID PK  |           |
| name      | String   |           |
| email     | String   | indexed   |
| subject   | String?  |           |
| message   | Text     |           |
| ipAddress | String?  |           |
| read      | Boolean  | for admin |
| createdAt | DateTime |           |

---

## 4. API ENDPOINTS

### `POST /api/enroll`
Submits a student enrollment application.

**Request body:**
```json
{
  "fullName": "Kwame Asante",
  "email": "kwame@example.com",
  "phone": "+233 XX XXX XXXX",
  "country": "Ghana",
  "currentRole": "Student",
  "experienceLevel": "BEGINNER",
  "programSlug": "data-science-ai",
  "motivation": "I want to transition into data science...",
  "gdprConsent": true
}
```

**Responses:**
```
201 { success: true, data: { message: "...", ref: "ABC12345" } }
409 { success: false, error: "An application with this email already exists..." }
409 { success: false, error: "This cohort is full..." }
422 { success: false, error: "Validation failed", details: { email: "Invalid email" } }
429 { success: false, error: "Too many requests..." }
```

**Side effects:**
1. Creates `enrollments` record (status: PENDING)
2. Sends team notification email
3. Sends student confirmation email

---

### `POST /api/waitlist`
Joins the waitlist for a future program.

**Request body:**
```json
{
  "fullName": "Zara Nkemdirim",
  "email": "zara@example.com",
  "interestArea": "CYBERSECURITY",
  "gdprConsent": true
}
```

**Valid interestArea values:** `AI` · `CYBERSECURITY` · `SOFTWARE_ENGINEERING` · `CLOUD_COMPUTING` · `OTHER`

**Responses:**
```
201 { success: true, data: { message: "...", ref: "..." } }
422 { success: false, error: "Validation failed", details: {...} }
```

**Note:** Idempotent — same email + interest area upserts rather than errors.

---

### `POST /api/instructor-apply`
Submits an instructor application.

**Request body:**
```json
{
  "fullName": "Desmond Dadzie",
  "email": "desmond@example.com",
  "expertiseArea": "Cybersecurity & Penetration Testing",
  "yearsOfExperience": 6,
  "linkedinUrl": "https://linkedin.com/in/desmondda",
  "proposal": "I would teach OWASP methodology..."
}
```

**Responses:**
```
201 { success: true, data: { message: "...", ref: "..." } }
200 { success: true, data: { message: "We already have an application..." } }
422 { success: false, error: "Validation failed", details: {...} }
```

---

### `POST /api/contact`
Sends a contact message to the team.

**Request body:**
```json
{
  "name": "Tobi Osei",
  "email": "tobi@example.com",
  "subject": "Payment options",
  "message": "I wanted to ask about payment plans..."
}
```

---

## 5. EMAIL SYSTEM

All emails use **Resend** (resend.com) with branded HTML templates.

### Emails sent per trigger:

| Trigger              | Recipient           | Type                      |
|----------------------|---------------------|---------------------------|
| Student enrolls      | Team (NOTIFICATION_EMAIL) | New enrollment notification |
| Student enrolls      | Student             | Application confirmed      |
| Waitlist signup      | Team                | New lead notification      |
| Waitlist signup      | Signer              | "You're on the list!"      |
| Instructor applies   | Team                | New application            |
| Instructor applies   | Applicant           | Application received       |
| Contact form         | Team                | New message notification   |

### Email template design:
- Prussian Blue (#042E4D) header
- Tween Learning branding
- Structured data table for applications
- Call-to-action for social follow
- Responsive HTML (renders on mobile mail clients)

---

## 6. SECURITY CHECKLIST

| Control                  | Implementation                                      | Status |
|--------------------------|-----------------------------------------------------|--------|
| Input validation         | Zod schemas, server-side only                       | ✅     |
| SQL injection            | Prisma ORM (parameterized queries, no raw SQL)      | ✅     |
| XSS                      | React output escaping + CSP headers                 | ✅     |
| Rate limiting            | 10 req / 60s per IP per endpoint                    | ✅     |
| Spam / bot protection    | Honeypot hidden field                               | ✅     |
| GDPR consent             | Checkbox injected on all forms, stored in DB        | ✅     |
| HTTPS                    | Enforced via Vercel + HSTS header                   | ✅     |
| Security headers         | X-Frame-Options, CSP, HSTS, nosniff                | ✅     |
| Secrets management       | Environment variables (never in code)               | ✅     |
| DB access                | Server-side only via Prisma — never client-exposed  | ✅     |
| CORS                     | Restricted to NEXT_PUBLIC_APP_URL                   | ✅     |
| Error messages           | Generic errors returned — no internal detail leak   | ✅     |
| Duplicate protection     | DB unique constraints + application-level checks    | ✅     |

**Recommended upgrades for scale:**
- Replace in-memory rate limiter with [Upstash Redis](https://upstash.com) (required for multi-instance/serverless)
- Add [Cloudflare WAF](https://cloudflare.com) in front of Vercel for additional bot protection
- Add [Sentry](https://sentry.io) for error tracking and alerting

---

## 7. DEPLOYMENT — STEP BY STEP

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier: 500MB, 2 projects)
- Resend account (free tier: 3,000 emails/month)

---

### Step 1 — Database Setup (Supabase)

```bash
# 1. Go to supabase.com → New Project
# 2. Name: tween-learning, Region: pick closest to Ghana (eu-west or us-east)
# 3. Note your database password

# 4. Get connection strings from:
#    Project Settings → Database → Connection String
#    Copy "Transaction" URL for DATABASE_URL
#    Copy "Session" URL for DIRECT_URL (used by Prisma migrations)
```

---

### Step 2 — Email Setup (Resend)

```bash
# 1. Go to resend.com → Create account
# 2. Settings → Domains → Add domain → tweenlearning.com (or tweentechnologies.com)
# 3. Add the DNS TXT/MX records shown (propagation takes 5-60 min)
# 4. Settings → API Keys → Create API Key → copy it
# 5. Set FROM_EMAIL to: Tween Learning <noreply@tweenlearning.com>
```

---

### Step 3 — Local Development

```bash
# Clone / create the project
git clone https://github.com/your-org/tween-learning
cd tween-learning

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in: DATABASE_URL, DIRECT_URL, RESEND_API_KEY, NOTIFICATION_EMAIL, FROM_EMAIL

# Generate Prisma client
npm run db:generate

# Run migrations (creates all tables)
npm run db:migrate:dev --name init

# Seed database
npm run db:seed

# Start dev server
npm run dev
# → http://localhost:3000
```

---

### Step 4 — Deploy to Vercel

```bash
# Option A: CLI
npm i -g vercel
vercel login
vercel

# Option B: GitHub Auto-deploy (recommended)
# 1. Push code to GitHub
# 2. Go to vercel.com/new → Import Git Repository
# 3. Select your repo → Deploy

# In Vercel Dashboard → Settings → Environment Variables, add:
# DATABASE_URL          = [Supabase transaction URL]
# DIRECT_URL            = [Supabase session URL]
# RESEND_API_KEY        = re_xxxxxxxx
# NOTIFICATION_EMAIL    = hello@tweentechnologies.com
# FROM_EMAIL            = Tween Learning <noreply@tweenlearning.com>
# NEXT_PUBLIC_APP_URL   = https://learn.tweentechnologies.com
```

---

### Step 5 — Run Database Migrations on Production

```bash
# After deploying, run migrations against production DB
# Add this to your Vercel build command, OR run manually:

DATABASE_URL="[your-prod-db-url]" npx prisma migrate deploy
DATABASE_URL="[your-prod-db-url]" npm run db:seed
```

Or add to `package.json` build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

---

### Step 6 — Connect Existing HTML to the Backend

Add this single line before `</body>` in your existing HTML file:

```html
<script src="/tween-forms.js"></script>
```

That's it. The script:
- Replaces `submitEnroll()`, `submitWlModal()`, `submitWaitlist()`, `submitApply()` with real API calls
- Injects additional form fields (phone, role, experience, motivation)
- Injects GDPR consent checkboxes on all forms
- Injects honeypot spam protection fields
- Shows inline validation errors from the API
- Shows success/error banners without redesigning the UI

---

### Step 7 — Custom Domain

```bash
# In Vercel Dashboard:
# Settings → Domains → Add → learn.tweentechnologies.com
#
# Add DNS records at your registrar:
# Type: CNAME
# Name: learn
# Value: cname.vercel-dns.com
#
# SSL certificate auto-provisioned by Vercel within ~2 minutes
```

---

### Step 8 — Verify Everything Works

Test each endpoint with curl or Postman:

```bash
# Test enrollment
curl -X POST https://learn.tweentechnologies.com/api/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "country": "Ghana",
    "currentRole": "Student",
    "experienceLevel": "BEGINNER",
    "programSlug": "data-science-ai",
    "motivation": "Testing the enrollment flow end to end",
    "gdprConsent": true
  }'
# Expected: 201 { success: true, data: { message: "...", ref: "..." } }

# Test waitlist
curl -X POST https://learn.tweentechnologies.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test2@example.com","interestArea":"AI","gdprConsent":true}'
# Expected: 201

# Check team inbox for notification emails
# Check test@example.com for confirmation email
```

---

## 8. MONITORING + ADMIN

### View Data (Supabase Dashboard)
Go to `supabase.com → your project → Table Editor`
- `enrollments` — all student applications
- `waitlist_entries` — leads by interest area
- `instructor_applications` — instructor pipeline
- `contact_messages` — unread messages

### Useful SQL Queries (run in Supabase SQL Editor)

```sql
-- Daily enrollment count (last 30 days)
SELECT DATE(created_at) as date, COUNT(*) as applications
FROM enrollments
GROUP BY date ORDER BY date DESC LIMIT 30;

-- Applications by program
SELECT p.title, COUNT(e.id) as applications
FROM programs p LEFT JOIN enrollments e ON e.program_id = p.id
GROUP BY p.title ORDER BY applications DESC;

-- Waitlist by interest area
SELECT interest_area, COUNT(*) FROM waitlist_entries GROUP BY interest_area;

-- Pending enrollments needing review
SELECT full_name, email, country, current_role, created_at
FROM enrollments WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

---

## 9. TIMELINE

| Task                                      | Time Estimate |
|-------------------------------------------|---------------|
| Set up Supabase project + schema          | 20 min        |
| Set up Resend + verify domain             | 30–60 min     |
| Configure .env and run migrations         | 10 min        |
| Deploy to Vercel                          | 10 min        |
| Add `<script>` tag to existing HTML       | 2 min         |
| Connect custom domain + DNS               | 30 min        |
| End-to-end test all 4 forms               | 20 min        |
| **Total**                                 | **~2.5 hours**|

---

## 10. FUTURE ENHANCEMENTS

Once the first cohorts are validated, consider:

| Priority | Feature                          | Tool/Approach              |
|----------|----------------------------------|----------------------------|
| High     | Admin dashboard to manage leads  | Next.js + Supabase RLS     |
| High     | Stripe payment integration       | Stripe Checkout            |
| Medium   | Email automation sequences       | Resend Broadcasts          |
| Medium   | Upstash Redis rate limiting      | @upstash/ratelimit         |
| Medium   | Error monitoring                 | Sentry                     |
| Low      | Analytics                        | PostHog or Plausible       |
| Low      | Student portal                   | Supabase Auth + Next.js    |
| Low      | Certificate generation           | PDF generation (Puppeteer) |

---

*Tween Technologies · Platform Engineering Spec v1.0 · 2025*
