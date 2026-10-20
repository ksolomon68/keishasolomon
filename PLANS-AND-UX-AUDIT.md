# Plans and UX audit

Reviewed October 20, 2026, on the local fixture site (`.data/cohort-browser-test`), signed in as the synthetic participant, a new Starter account and the synthetic instructor.

## What changed

### Three plan levels

| Plan | Who it's for | Price shown | How people join |
| --- | --- | --- | --- |
| **Starter** | Individuals | Free | `/start`: name, email, password. No access code. |
| **Teams** | Businesses training staff | Custom, quoted by team size | Request form on `/plans`, then a cohort access code |
| **Leadership Programs** | Leadership programs and workshops | Custom | Request form on `/plans`, then a cohort access code |

- **`/plans`**: plan cards, a comparison table, a request form for Teams and Programs, and FAQs. `?plan=programs` preselects the form.
- **Starter accounts** are participants with no cohort, so no database column was needed. They get their own dashboard:
  1. **AI Fit Check** (new). Six questions about a task, then an explained verdict: *Good fit*, *Worth trying with care*, *Keep this human*, *Protect the data first* or *Don't use AI*. Sensitive data, and high stakes that can't be checked, always override the score. The logic is in `lib/ai-fit.ts` and tested in `tests/ai-fit.test.ts`.
  2. Prompt workshop (existing).
  3. Four safety rules plus the Safe Harbor commitments.
  4. Two practice decisions, a personal task list, and an upgrade panel with an **access-code box**. Entering a code moves the account into that cohort and keeps its task list.
- **Guards**: the server refuses cohort features for Starter accounts (submissions, tool drafts, help requests, coaching, capstone, certificate), not only the page.
- **Instructor view**: a new *Team & program requests* section on `/admin` with New / Contacted / Closed status and a count of Starter members. User Accounts can filter by and assign "Starter plan (no cohort)".
- **Site-wide**: the nav has *Plans* and *Start free*. The hero, the closing CTA and the footer now lead to Start free, Plans or the access-code route. Ask Sandbox answers questions about plans, pricing and when to use AI. The AI Fit Check is also in the cohort dashboard's toolkit.

### Dashboard fixes

- **Mismatched next step**: the panel said "Continue your Safe Harbor Usage Policy" while the card said *Ready to start*. It now says **Start** or **Continue** based on the work's actual status.
- **Help section opened with a full form** whenever there were no threads. It now starts collapsed behind *Ask your instructor*.
- **Jargon**: "friction" in the welcome text, progress tiles, form heading and save message now reads "workplace problems" or "your list". Sign-in no longer says "log friction".
- **Plans table on phones** made the whole page 513px wide at a 375px screen. Hidden screen-reader labels were escaping the scroll box. Fixed, and the table now fits at 375px.

## Verified

- In the browser: an empty request form shows field errors; a valid request is saved and shows up in `/admin`, where its status change saves. Starter signup lands on the Starter dashboard. The Fit Check returns the right verdicts and moves focus to the answer. The Starter task list saves without a session picker. A Starter account is sent away from `/certificate`. An invalid code shows an error; a valid code joins the cohort and the task list carries over. The next-step wording and the collapsed help form are correct after joining. `/plans`, `/` and `/dashboard` have no horizontal scroll at 375px.
- `tsc --noEmit` passes, and all 35 tests pass (7 files, including the new Fit Check tests). ESLint shows only issues that were already there (`tests/draft-migration.test.cjs`, plus an unused import in `user-manager.tsx`).
- **Not verified**: the MySQL store (only the file store was exercised), the production build, a screen reader, or testing with real users. The screenshot tool couldn't capture full desktop frames, so desktop layout was checked through the DOM, not by eye.

## Decisions for you

1. **Plan contents and prices.** Teams lists "Progress summaries for your team lead" and coaching as "Optional". No team-lead login exists yet, so for now those summaries are something you'd send by hand. Confirm or edit the lists in `data/plans.ts`. No prices are shown anywhere.
2. **Form promises.** The request form says people get "a short call" and "a proposal by email". Change these in `app/plans/page.tsx` if that isn't your process.

## Recommended next steps

1. ~~**Password reset.**~~ Done: see *Password reset* below.
2. **Email alerts for new requests.** Requests only appear in `/admin`. `lib/email.ts` already exists and could notify you.
3. **Set `NEXT_PUBLIC_CONTACT_EMAIL`.** The footer still says no public support email has been posted.
4. **Team-lead role** for Teams: a read-only progress view for one cohort.
5. **One progress measure.** The dashboard shows deliverables (1/7) and capstone steps (0/11), but the certificate depends only on the capstone. Participants can't easily tell which one matters.
6. **App-style nav when signed in.** Participants still see marketing links (Method, Syllabus, Safe Harbor) above their dashboard.
7. **Broaden the hero.** It still speaks only to executives in an in-person cohort. Individuals and team buyers find their path from the CTAs, not the headline.

## Password reset

- The sign-in page has **Forgot your password?** It leads to `/forgot-password`, which emails a link to `/reset-password`. Choosing a new password signs the person in.
- Links are single-use and expire after 60 minutes. Requesting a new link cancels older ones. Only a SHA-256 hash of each token is stored, in the new `password_resets` table.
- The reply is the same whether or not the email has an account, and the email is sent after the response, so the timing doesn't give it away either. Requests are rate-limited per connection and per email address. Links always use `NEXT_PUBLIC_SITE_URL`, never the request's host. The reset page sends no Referer header.
- **Needs SMTP.** Set `SMTP_HOST` and `SMTP_PASS` (see `.env.example`) in production, or reset emails are never sent. The server logs an error when that happens. In local development without SMTP, the dev server prints the reset link to its log instead.
- **Known limit:** sessions are stateless signed cookies, so a reset does not sign out other devices that are already signed in. They expire within 7 days. To sign everyone out immediately, rotate `SESSION_SECRET`.
- Verified in the browser: the same reply for an unknown and a known email; the link appears in the dev log; mismatched passwords show an error without using up the link; a valid reset signs the person in; a reused link is refused with a "request a new one" link. The store test covers single use, expiry and replacement.

## Deploying

Run `npm run db:migrate` first. It creates the new `plan_inquiries` and `password_resets` tables, and running it again is safe. Make sure SMTP is configured. Then rebuild and commit `.next` as usual.
