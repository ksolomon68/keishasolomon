# Cohort experience audit

Reviewed September 20, 2026. Local repository and development site.

## Verdict

The site has a strong visual foundation and a practical curriculum. Navy, cream, amber, editorial typography, and consistent components already give it a credible identity. It has useful interaction: syllabus filters, disclosures, onboarding progress, friction logging, submissions, and capstone milestones.

It is not yet possible to say the platform reliably delivers measurable cohort value. Its central weakness is the connection between a participant's workplace problem, guided practice, instructor feedback, and evidence of improvement. Completion counts alone do not demonstrate learning or business impact.

Keep the visual identity. Prioritize the learning journey and reliable feedback before adding decorative animation or more dashboard widgets.

## Scope and evidence

- Browser-reviewed the local landing page, onboarding, sign-in, and registration. Inspected desktop at 1440 px, mobile at 390 px, and tablet registration at 768 px; this is a targeted responsive review, not a full device certification.
- Verified syllabus filtering changes eight sessions to the selected two; onboarding progress survives reload; mobile navigation opens; empty sign-in produces field-specific errors. Restored the checklist after testing.
- Confirmed the signed-out dashboard redirects to sign-in. Participant and instructor screens were reviewed in source, not through authenticated browser sessions. No participant account or production data was modified.
- Examined the curriculum, dashboard components, store contract, instructor page, submission actions, date utilities, shared fields, and design tokens.
- `npm run typecheck` passes. `npm run lint` fails with seven pre-existing CommonJS `require()` rule errors in `app.js`, `scripts/create-admin.js`, and `scripts/migrate.js`.
- Ran the existing date function directly: both April 1 and June 1, 2027 return `s6` as the next session with the current schedule.
- No new axe audit, authenticated upload test, production deployment check, performance benchmark, or participant usability study was performed. The README's earlier accessibility claims were not independently recertified.
- No separate PRD, app-flow, design-system, or progress document was found in the project search; the README, source, and `app/globals.css` provide the current specification. The design-audit skill's referenced audit template was absent, so this report follows its documented three-phase structure.

## Phase 1 — Critical: make participation useful and trustworthy

### 1. Close the friction-log-to-instructor loop

**Evidence:** `components/dashboard/friction-log.tsx` says entries steer the labs. `app/admin/page.tsx` fetches users, attendance, deliverables, capstone, and resources, but never friction entries. The instructor roster has no friction view.

**Change:** Add an instructor-only view of participant friction points, grouped by target session. Show task, frequency, estimated weekly effort, and open/solved state. Make the visibility statement explicit where participants enter data. Preserve participant isolation.

**Acceptance:** A participant records a problem for Session 3; the instructor can find it under Session 3; another participant cannot retrieve it. An empty instructor view explains how logs arrive.

### 2. Give reviewed work actual feedback and a valid revision state

**Evidence:** `lib/store/types.ts` has participant notes but no instructor feedback field. `components/admin/roster.tsx` offers a status dropdown. `app/actions/dashboard.ts:82` preserves `reviewed` even when the participant changes the work. Required evidence validation applies only to `submitted`, so a reviewed submission can lose its link/file while retaining its reviewed label.

**Change:** Persist instructor feedback separately from participant notes. Add a clear revision path. Content changes to reviewed work should return it for review; unchanged saves should preserve the review. Validate required evidence in both submitted and reviewed states. Associate review with the version actually inspected.

**Acceptance:** Participants can read feedback and their next improvement; replacement/removal of reviewed evidence cannot silently retain approval; only instructors can review; errors preserve entered notes.

### 3. Make session status accurate

**Evidence:** `lib/dates.ts:37` treats any undated session as upcoming forever. March's undated `s6` blocks April, May, and the cohort-complete state. `components/dashboard/countdown.tsx:36` labels a past calendar date “Completed,” without reference to attendance or work. Countdowns run to local midnight, not a confirmed class start.

**Change:** Show the next confirmed session and a separate pending-date notice. Distinguish “Session has passed” from participant completion. Display date-level information until a real time/timezone is configured; do not imply that midnight is the class start.

**Acceptance:** April and May remain discoverable when March is unconfirmed; after the last confirmed session, pending dates remain explicit without inventing completion. Cover before/day-of/after dates and all-undated schedules.

### 4. Put one useful next action above the roadmap

**Evidence:** `app/dashboard/page.tsx` leads with aggregate counts, followed by eight equally weighted session cards, then the friction log, submissions, and capstone. It does not connect the next session to a preparation task or a particular submission.

**Change:** Lead with a “Your next step” panel: next confirmed session, preparation, current deliverable, feedback needing attention, and one primary action. Keep the full roadmap in a secondary disclosure. Before Session 1, the action should help a new participant log one concrete workplace problem. Afterwards, prioritize feedback or unfinished work over distant sessions.

**Acceptance:** A first-time participant and a returning participant can each identify the next useful action without scrolling through the full curriculum. Links open the exact session or deliverable, not just a large section.

### 5. Define what good work looks like

**Evidence:** Session content names outputs, but lacks an explicit preparation brief, worked example, success checklist, and between-session practice. Empty resource cards promise materials later.

**Change:** For each of the seven deliverables, provide preparation, a short build sequence, a synthetic example, a reusable starter, and three to five review criteria. Provide core guidance directly in the module so an unpopulated resource library is still useful. Clearly label any proposed practice time as an estimate until the instructor confirms it.

**Example — AI Readiness Audit:** Identify one repetitive task; record its present frequency and duration; describe acceptable inputs and data boundaries; run one synthetic example; state what a human must check; choose one next experiment. Evidence should include the audit and a sample output, not just a “done” checkbox.

**Acceptance:** A participant can begin and self-check an assignment without asking what to submit. Instructor criteria match the participant checklist.

### 6. Provide real logistics and a route to help

**Evidence:** The public schedule has dates but no venue or session start time. The rendered footer promises email help without displaying an email address in this environment. Sign-in has no recovery route. “Join the cohort” leads to a form requiring an existing access code.

**Change:** Display confirmed logistics or a truthful pending notice. Configure a real support contact and offer an account-help route on sign-in and registration. Label registration “Activate your participant account” if it is invitation-only. Provide a distinct inquiry route only if the instructor wants public enrollment.

**Acceptance:** Someone without an access code or with a forgotten password has a reachable next step. No invented venue, contact address, support turnaround, or session time.

## Phase 2 — Refinement: make progress clear and the interface calmer

### 7. Measure outcomes, not just activity

The friction log estimates time spent on open tasks; solving a task removes its contribution. There is no before/after duration, observation period, quality check, or retained evidence of savings.

Add baseline and observed duration, frequency, sample count/date, human review effort, and a short evidence note. Calculate net time saved with the assumptions visible. Keep negative and zero outcomes valid: a failed experiment is useful learning. Use “estimated opportunity” before measurement and “observed result” only after evidence is recorded. Let participants export a concise capstone evidence summary. Do not count every solved task as 100% time saved.

Acceptance: a 30-minute weekly task that takes 20 minutes including review reports 10 minutes/week saved; a slower result is not silently clamped to a success.

### 8. Reduce repeated visual weight

Preserve the existing color and font tokens. Use the display font for section headings and results, the sans font for instructions, and mono labels sparingly. Give the current session the strongest hierarchy; use compact date labels for future sessions instead of eight competing countdowns. Replace horizontally scrolling onboarding schedule tables with stacked date/theme/action cards on phones. Keep dense instructor tables available on desktop, with a usable participant-detail view on mobile.

The public hero's agenda is attractive but explains facilitation before participants have seen an example outcome. Shorten the hero description and show a concrete sample artifact or a problem-to-result example earlier. Move detailed facilitation timing lower on the page. Avoid fabricated testimonials or savings claims.

Acceptance: at 390 px, dates, task titles, statuses, and primary actions remain readable without sideways page scrolling; at 200% zoom, controls remain usable and text does not overlap.

### 9. Make promises proportionate to evidence

“Immediate ROI,” a next-morning deployable asset every month, “30–40%” of an executive's day, and “3–5 hours per week” appear without supporting evidence in the repository. Treat quantified savings as hypotheses to test or provide the source and its context. Make prototype, pilot, and deployed workflow distinct outcomes.

Privacy copy says everything is visible to the participant and Keisha alone, while authorization permits any account with the instructor/admin role. Describe access by role unless the operating setup truly guarantees a single instructor.

Acceptance: copy describes outcomes the course supports, without guaranteeing savings or implying deployment readiness before review.

## Phase 3 — Polish: make interaction resilient

- **Checklist fallback:** `components/onboarding/checklist.tsx:23` returns an empty array when browser storage fails and discards write failures. Despite its comment, it has no working in-memory fallback. Keep page-session state when storage is unavailable and disclose that it will not survive reload.
- **Recoverable mutations:** friction deletion is immediate and optimistic; capstone and roster updates have no local recovery message. Add appropriate pending states, contextual failure/retry messages, and undo or a deliberate delete confirmation for valuable entries.
- **Accessible form errors:** field errors are associated with controls, which is good. The tested invalid sign-in did not focus the first invalid field, and field-only errors do not populate the alert message. Add an announced error summary or deliberate focus handling; verify using a screen reader.
- **Useful practice:** add one optional synthetic prompt exercise with revealable critique, or a guided before/after comparison. Explain why an answer is stronger. Do not add points or badges that reward clicks instead of useful work.
- **Resource discovery:** show resource type and purpose clearly, retain helpful empty states, and test unavailable files/links and upload failure recovery.

## Design-system and implementation notes

Reuse `app/globals.css` color, typography, focus, and reduced-motion tokens; no replacement palette is needed. Document the new next-action panel, outcome card, feedback block, and mobile session card as shared patterns. Each needs empty, loading, error, and completed states. Keep amber for the primary action, cyan for guidance, green for confirmed success, and explicit text labels alongside colors.

Phase 1 includes functional work beyond visual design: instructor access to friction entries, review persistence, submission transitions, and schedule selection. Phase 2 outcome tracking also requires a schema/store change. Apply migrations and maintain both MySQL and local-file backends together. Do not treat these as CSS-only tasks.

Before implementation, read the installed Next.js guides as required by AGENTS.md. Correct the lint configuration for intentional CommonJS scripts without broadly disabling unrelated rules. Run lint, typecheck, focused date/state tests, and authenticated browser tests with synthetic participant and instructor accounts. Verify permissions, persistence, validation recovery, and mobile layouts. Run an accessibility audit and manual keyboard checks on the resulting flows.

## Success criteria for a cohort pilot

These are proposed acceptance goals, not measured results:

1. A new participant can identify the first action and record a workplace problem without coaching.
2. A returning participant can find the next session, its preparation, and their latest feedback within one minute.
3. Every deliverable has a starter/example, observable review criteria, and a clear submission route.
4. The instructor can see upcoming lab needs and respond to a submission with actionable feedback.
5. Each capstone contains a baseline, a tested result, a quality check, and an adoption decision.

Validate with three to five representative participants, including someone with low AI confidence, before claiming the experience is easy or effective. Observe task completion and confusion; do not rely only on satisfaction scores.

## Recommended implementation order

First correct scheduling, review-state integrity, checklist fallback, and missing support/logistics messaging. Then build the next-action panel, instructor friction view, feedback loop, and seven deliverable guides. Add measured-outcome tracking and responsive refinements next. Finish with recovery states, guided practice, and participant testing.

This document records the original audit. The user subsequently approved Phase 1, which has been implemented locally and supplemented with source-informed practice content. See `CONTENT-SOURCE-NOTES.md` and `progress.txt` for the delivered changes, test results, deployment requirements, and remaining verification. Phase 2 outcome tracking remains a proposal.
