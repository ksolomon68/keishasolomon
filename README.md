# The AI Executive Sandbox — keishasolomon.com

Cohort platform for **The AI Executive Sandbox: Applied Leadership & Innovation**, taught by Keisha Solomon (EVOBRAND Concepts).

- **Public site** (`/`, `/onboarding`): landing page, filterable syllabus timeline, onboarding checklist, Safe Harbor pledge.
- **Participant portal** (`/dashboard`): session modules with countdowns and materials, Workplace Friction log, deliverable submission hub, capstone tracker.
- **Instructor view** (`/admin`): pick a cohort, then its settings (access code, session dates, certificate date), roster (attendance, deliverable review, capstone progress) and resource manager.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · lucide-react · MySQL (`mysql2`) · bcrypt + signed session cookie · zod.

## Quick start (local)

```bash
npm install
npm run dev          # http://localhost:3000
```

`.env.local` is already set up for local development with `DATA_BACKEND=file`, which stores data in `.data/db.json` so you
can run everything without a database. Create an instructor account, sign in, create a cohort in `/admin`, then
register participants at `/register` with that cohort's access code:

```bash
ADMIN_PASSWORD='choose-a-long-password' npm run admin:create -- "Keisha Solomon" you@yourdomain.com
```

## Instructor guide

`/admin/guide` (button on the command center) is a printable facilitation booklet: the 90-minute run of show, how to review
work, and a chapter per session with prep, hook and lab steps, coaching notes, peer stress-test prompts, the discussion case,
review criteria and a capstone checkpoint. It is generated from the same data as the participant dashboard
(`data/cohortData.ts`, `data/learning-guides.ts`, `data/cohort-practice.ts`) plus instructor-only notes in
[`data/instructor-guide.ts`](data/instructor-guide.ts), and uses the selected cohort's dates and headcount (the showcase
chapter sizes the demo block from it). Use **Print / Save as PDF** with Letter, portrait and *Background graphics* on.
Edit the facilitation wording in `data/instructor-guide.ts`; everything else follows the curriculum.

## Running several cohorts at once

The curriculum (sessions, deliverables, capstone) is shared. A **cohort** is one run of it, and each cohort keeps its own:

- **Roster and progress**: a participant belongs to exactly one cohort, chosen by the access code they register with.
  Friction logs, deliverables, attendance and capstone progress are per participant, so cohorts never see each other's work.
- **Access code**: unique per cohort and managed in `/admin` (generate, rotate, or archive to close registration).
  Archived cohorts stay readable and existing participants keep their access.
- **Calendar**: each cohort has its own session dates. The dashboard, onboarding page, countdowns and roster all use them.
- **Resources**: published to the selected cohort, or shared with every cohort by ticking *Share with every cohort*.
  Participants can only download files published to their own cohort (or shared ones).
- **Certificate**: shows the cohort name and its own completion date (defaults to the cohort's last session date).

The instructor account sits above all cohorts. `/admin?cohort=<id>` scopes every stat, roster and review to one cohort.
The public landing page still shows the programme's default schedule from `data/cohortData.ts`.

## Switching to MySQL

1. In `.env.local` (or your host's environment settings) set `DATA_BACKEND=mysql` and the `DB_*` values.
   Locally, a hosted database must allow your IP (cPanel → **Remote MySQL**) and `DB_HOST` must be the server hostname;
   when the app runs on the same server as MySQL, `localhost` is correct.
2. Create the tables: `npm run db:migrate` (idempotent, applies `db/schema.sql`).
3. Create the instructor account with `npm run admin:create` as above.

`DATA_BACKEND=file` is refused when `NODE_ENV=production`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATA_BACKEND` | `mysql` (production) or `file` (local dev only) |
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | MySQL connection |
| `SESSION_SECRET` | ≥ 32 random characters; signs session cookies. Rotate to sign everyone out. |
| `COHORT_ACCESS_CODE` | Optional. Only used once, to keep the existing access code on the "Founding cohort" when `db:migrate` upgrades a single-cohort database. Access codes are otherwise managed per cohort in `/admin`. |
| `UPLOAD_DIR` | Where uploaded files are stored. Must be a **persistent** directory in production. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. Shown in the footer when set. |

Never commit `.env.local` (it is git-ignored). Copy `.env.example` when configuring a new environment.

## Deploying (cPanel Git deployment)

The repo includes `.cpanel.yml`, which runs [`scripts/cpanel-deploy.sh`](scripts/cpanel-deploy.sh). On each deploy it copies the
code to `~/sandbox-app`, keeps the server's `.env.local`, `storage/` and `node_modules/`, runs `npm install` and
`npm run build`, then restarts the app.

**One-time setup**

1. **cPanel → Setup Node.js App → Create Application**: Node **20.9 or newer**, mode *Production*, Application root
   `sandbox-app`, Application URL your domain, Startup file `server.js`. (To use another folder name, change `APP_NAME` in the script.)
2. Create `~/sandbox-app/.env.local` on the server (File Manager or SSH) with the production values from `.env.example`:
   `DATA_BACKEND=mysql`, `DB_*`, a fresh `SESSION_SECRET`, and `UPLOAD_DIR=./storage`. The deploy stops with a clear error if it is missing.
3. **cPanel → Git Version Control → Create**, clone `https://github.com/ksolomon68/keishasolomon.git` (branch `main`).
4. First deploy: **Manage → Pull or Deploy → Update from Remote**, then **Deploy HEAD Commit**.
5. After the first deploy, in the app's terminal (Setup Node.js App shows the command to enter the virtual environment):
   `npm run db:migrate` then `ADMIN_PASSWORD='…' npm run admin:create -- "Keisha Solomon" you@yourdomain.com`.

**Every later deploy:** push to `main`, then *Update from Remote* and *Deploy HEAD Commit*.

**If cPanel says "uncommitted changes"**: the server's clone has edited or untracked files. Never edit files inside the Git Version Control
clone (the app lives in `~/sandbox-app`, not there). Over SSH, in the clone: `git status`, then `git restore .` (and `git clean -fd` for untracked files), then pull again.

**Troubleshooting**: the build needs roughly 1.5 GB of memory; if the host kills it, build locally with `npm run build` instead and ask your host to raise the limit.
Deploy output is shown in the Git Version Control deployment log. Serve the site over **HTTPS** (session cookies are `Secure` in production).
Behind a reverse proxy, forward the public host in `X-Forwarded-Host` (Server Actions check origin).

## Editing content

All curriculum content lives in [`data/cohortData.ts`](data/cohortData.ts): session themes, hooks, labs, deliverables,
the 90-minute agenda, onboarding checklist, Safe Harbor copy and the capstone steps. The landing page, dashboard,
roster and tracker all read from it. The `date`, `dateLabel` and `shortDate` values there are the programme's *default*
calendar (public site, and the starting dates for a new cohort); each cohort's real dates are edited in `/admin`.
When the **March 2027** date is announced for the founding cohort, set it under that cohort's *Session 6* date.

## Project layout

```
app/                 routes: /, /onboarding, /login, /register, /dashboard, /admin, /api/files/[id]
  actions/           Server Actions (auth, dashboard, admin) — each re-checks the session
components/          landing/, dashboard/, admin/, auth/, onboarding/, layout/, ui/
data/cohortData.ts   single source of truth for content
lib/auth/            passwords (bcrypt), session (signed JWT cookie), login rate limiter
lib/store/           Store interface + mysql.ts and file.ts implementations
lib/uploads.ts       upload validation (10 MB cap, extension allowlist, random stored names)
db/schema.sql        MySQL schema
scripts/             migrate.ts, create-admin.ts, cpanel-deploy.sh
server.js            startup file for cPanel Node.js hosting (Passenger)
.cpanel.yml          cPanel Git deployment tasks
```

## Security notes

- Passwords are bcrypt-hashed (cost 12); sessions are signed, `httpOnly`, `SameSite=Lax` cookies. The user row is re-read on every request, so removed accounts and role changes apply immediately.
- Every page, action and file download checks authentication and ownership on the server. Participants can only read their own deliverable files and the resources published to their own cohort (or shared with all); instructors can read everything.
- Uploads are limited to 10 MB and an extension allowlist, stored under random names, and always served as attachments with `nosniff`.
- User-supplied links are validated as `http(s)://` only before being stored or rendered.
- The failed-login limiter is in-memory (per server process). Use a shared store if you run multiple instances.

## Scripts

`npm run dev` · `build` · `start` · `lint` · `typecheck` · `db:migrate` · `admin:create`

## Guided practice and instructor feedback

The dashboard includes a reusable prompt workshop and seven decision exercises adapted from the supplied cohort source summary. See `CONTENT-SOURCE-NOTES.md` for the source mapping, editorial choices, and validation limits. Core guides live in `data/learning-guides.ts`; no AI API or paid scheduling tool is required to use them.

Instructor feedback is stored separately from participant notes and identifies the revision reviewed. Changing evidence or notes on reviewed work returns it for review; concurrent stale saves are rejected. For changes inside a linked document, participants should describe their changes in the progress notes and resubmit. The site cannot detect edits made at an unchanged external URL.

**Existing MySQL sites:** run `npm run db:migrate` before deploying this version. It adds the feedback and revision columns idempotently. Existing local-file records receive compatible defaults when read.

**Upgrading to multiple cohorts:** the same `npm run db:migrate` adds `users.cohort_id` and `resources.cohort_id`, then moves every existing participant and resource into a **Founding cohort** that keeps your current access code (from `COHORT_ACCESS_CODE`; if that is unset it prints a new one). It only does this the first time, so re-running it never overwrites later edits. Run it *before* the new code goes live, since the app now reads those columns. Local `.data/db.json` files upgrade automatically when read.

`npm test` runs focused scheduling, revision, persistence, and practice-content tests. For isolated HTTP testing, first run `node --import tsx scripts/seed-cohort-test.ts`, then start a development server on port 3100 with `DATA_BACKEND=file`, `LOCAL_DATA_DIR=.data/cohort-browser-test`, `COHORT_TEST_BUILD=1`, and a development `SESSION_SECRET`. Use `npm run dev -- --port 3100 --webpack`, then `node scripts/smoke-cohort.mjs`. The smoke test uses fictional accounts and modifies only their fixture records. It refuses to run if the fixture includes non-test email addresses. Do not use the fixture server as the deployed site.

Set `NEXT_PUBLIC_CONTACT_EMAIL` to the real public support address. Time, time zone, venue, and the pending March date still need confirmation. Avoid publishing guessed logistics.

## Accessibility

Built to WCAG 2.1 AA: semantic landmarks, skip link, keyboard-operable accordions/filters/forms, visible focus rings, `aria-live`
status messages, form errors tied to fields via `aria-describedby`, reduced-motion support, and contrast-checked palette tokens
(see `app/globals.css`). Checked with axe-core and a computed-contrast sweep on the landing, onboarding, dashboard and instructor pages (0 violations).
