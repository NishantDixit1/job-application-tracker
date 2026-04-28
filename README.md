# JobTrack

A clean, AI-assisted way to track every job application from wishlist to offer.
Built as a full-stack assignment with **Next.js 16**, **TypeScript**, **Prisma + Postgres**,
**Auth.js** (Google OAuth), **shadcn/ui + Tailwind**, and the **Vercel AI SDK**
(Anthropic Claude).

## Why this app

Job seekers juggle dozens of applications across companies, recruiters, and stages.
Spreadsheets get messy and copy-pasting job descriptions into a tracker is tedious.
JobTrack solves both: a kanban-style board for at-a-glance pipeline view, and an
**AI autofill** that turns a pasted job posting into a populated application form
in one click.

## Features

- **Sign in with Google** (Auth.js v5, Prisma adapter)
- **CRUD applications** — company, role, status, location, salary, job URL, notes
- **Kanban + List views** — flip between board and list; move cards between
  stages with one click (Wishlist → Applied → Interviewing → Offer → Rejected)
- **AI autofill** — paste a job description, Claude extracts company / role /
  location / salary and writes a 3–5 bullet summary
- **Per-user data isolation** — every query is scoped to `userId`; deletes use
  `where { id, userId }` so a user can never read or mutate another user's
  applications
- **Server-side validation with Zod** on every mutation
- **Optimistic UI** with `useTransition` and toast feedback (sonner)
- **Accessible** — shadcn/ui (built on @base-ui/react) ships with proper ARIA
  semantics; forms use real `<label>` associations; dialogs trap focus

## Tech stack

| Layer        | Choice                                     |
| ------------ | ------------------------------------------ |
| Framework    | Next.js 16 (App Router, Turbopack default) |
| Language     | TypeScript (strict)                        |
| Styling      | Tailwind CSS v4 + shadcn/ui                |
| Database     | PostgreSQL (Prisma 7 + `@prisma/adapter-pg`) |
| Auth         | Auth.js v5 (Google OAuth, JWT sessions)    |
| Validation   | Zod                                        |
| Forms        | react-hook-form                            |
| AI           | Vercel AI SDK + `@ai-sdk/anthropic`         |
| Notifications | sonner                                     |

## Project structure

```
src/
  app/
    (auth)/login/page.tsx              # Google sign-in
    (protected)/                        # Auth-gated routes
      layout.tsx                        # Calls auth() and redirects
      dashboard/page.tsx                # Kanban + list of applications
      applications/
        new/page.tsx                    # Create form
        [id]/page.tsx                   # Detail + edit + delete
    api/auth/[...nextauth]/route.ts     # Auth.js handlers
    error.tsx                           # Global error boundary
    not-found.tsx                       # 404 page
    page.tsx                            # Marketing landing
  components/
    application-form.tsx                # Shared create/edit form
    ai-extract-input.tsx                # Paste-JD-and-autofill UI
    application-card.tsx                # Card used in list + kanban
    kanban-board.tsx                    # 5-column board view
    delete-application-button.tsx       # Confirmation dialog
    nav.tsx                             # Top nav with avatar menu
    ui/                                 # shadcn primitives
  lib/
    actions.ts                          # Server Functions: CRUD
    ai.ts                               # Server Function: AI extraction
    auth.ts                             # NextAuth config
    db.ts                               # PrismaClient singleton
    validation.ts                       # Zod schemas + status meta
prisma/
  schema.prisma                         # User, Account, Session, Application
```

## Getting started

### 1. Prerequisites

- Node.js 20.9+
- A PostgreSQL database — easiest via [Neon](https://neon.tech) (free tier)
  or [Supabase](https://supabase.com), or local Docker.
- A Google Cloud OAuth client — [console](https://console.cloud.google.com/apis/credentials)
- An Anthropic API key — [console](https://console.anthropic.com/) (only needed
  if you want the AI autofill feature)

### 2. Install

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL="postgresql://user:password@host:5432/job_tracker?schema=public"
AUTH_SECRET="<run: npx auth secret>"
AUTH_GOOGLE_ID="<from Google Cloud Console>"
AUTH_GOOGLE_SECRET="<from Google Cloud Console>"
ANTHROPIC_API_KEY="<from console.anthropic.com>"  # optional
```

For Google OAuth, add `http://localhost:3000/api/auth/callback/google` (and the
Vercel preview / production equivalents) to the **Authorized redirect URIs**.

### 4. Push the schema

```bash
npm run db:push        # quick sync, no migration file
# or
npm run db:migrate     # creates a migration file
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | Start the dev server (Turbopack)                     |
| `npm run build`      | Production build                                     |
| `npm run start`      | Run the production build                             |
| `npm run lint`       | ESLint                                               |
| `npm run typecheck`  | `tsc --noEmit`                                       |
| `npm run db:push`    | `prisma db push` — sync schema to DB without migrations |
| `npm run db:migrate` | `prisma migrate dev` — create + apply a migration    |
| `npm run db:studio`  | Open Prisma Studio                                   |

## Deploying

### Vercel (recommended)

1. Push this repo to GitHub.
2. Import the repo on [vercel.com/new](https://vercel.com/new). Vercel detects
   Next.js automatically.
3. Add the environment variables (`DATABASE_URL`, `AUTH_SECRET`,
   `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ANTHROPIC_API_KEY`) under
   **Project Settings → Environment Variables**.
4. Set `AUTH_TRUST_HOST=true` if you see callback URL warnings.
5. Add the Vercel deployment URL (e.g. `https://job-tracker.vercel.app/api/auth/callback/google`)
   to your Google OAuth **Authorized redirect URIs**.
6. Deploy. Future pushes to `main` auto-deploy (CI/CD).

### Database

For Neon: copy the **pooled** connection string into `DATABASE_URL`. The
`@prisma/adapter-pg` driver supports both direct and pooled connections.

## Security notes

- **AuthZ on every mutation.** Every server action calls `auth()` and uses
  `where { id, userId }` so the database itself enforces ownership — even a
  forged client request can't reach another user's row.
- **Input validation.** Every input is parsed with Zod on the server before it
  hits Prisma. URLs are validated, strings are trimmed and length-capped.
- **No SQL injection surface.** All queries go through Prisma's parameterized
  query API.
- **Auth secrets** are never sent to the client. The Anthropic key is server-only
  (the AI call lives in `src/lib/ai.ts` with `"use server"`).
- **Session strategy is JWT.** No session DB lookups on every request, but the
  user's `id` is verified by `auth()` on each protected page render.
- **Rate-limiting & abuse**: not implemented in this assignment scope; for
  production add a per-user rate limit on the AI endpoint (Upstash Ratelimit is
  ~5 lines of code) and on Auth callbacks.

## Trade-offs and what's out of scope

- **No tests.** A real production app would have Vitest unit tests for the Zod
  schemas + server actions and a Playwright e2e covering create → edit → delete.
  Skipped here for assignment scope; the action layer was designed to be
  trivially testable (pure inputs in, `ActionResult` out).
- **No drag-and-drop.** The kanban uses a `<Select>` to move cards — accessible
  by default, no extra dependency. DnD-kit could be added in ~1 day.
- **Single entity.** No `Company` table or `Contact`/`InterviewNote` children —
  intentionally scoped to one resource so the CRUD plumbing is the focus, not
  schema breadth.
- **Edit-only `appliedAt`.** The "applied date" is set at create time and
  shown read-only afterwards. A date picker is the obvious follow-up.

## Author

Built by Nishant as a full-stack assignment.
