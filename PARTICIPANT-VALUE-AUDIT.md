# Participant value and journey audit

Scope: source review of public discovery, Starter signup, invited registration, preparation, participant next steps, drafts, feedback, and support. Local validation is recorded below. This is not a production usability study or a claim about measured learning outcomes.

## Changes in this pass

- Removed the home-page “Cohort 01” label. The current source already contains no visible calendar dates in the home-page components. Added explicit self-paced versus organization-scheduled guidance and direct activation/sign-in links near the hero actions.
- Explained that the public curriculum is a learning sequence with a cohort-specific schedule.
- Stopped the public preparation page from presenting the default founding-cohort dates. Cohort members still see their own schedule. Visitors and Starter members receive a schedule explanation instead.
- Replaced the preparation page's universal account-creation action with a dashboard action for signed-in users, plus separate activation and free-start actions for visitors.
- Explained that preparation checklist progress is browser-local and can be printed before changing devices.

## Journey findings

| Stage | Evidence | Participant impact / recommendation |
| --- | --- | --- |
| Arrival | Hero previously labeled every visit Cohort 01; old dates remain in shared cohort defaults | Public messaging now avoids a specific intake. Check the deployed home page after release; the committed production build is separate from these source edits. |
| Choose a path | /start is free; /register needs an invitation; /login is for returning users | Direct paths now appear near the hero. Keep free learning and instructor-supported cohort expectations explicit. |
| Account creation | Starter registration creates a session and redirects to /dashboard; cohort registration and joining redirect to /onboarding | Existing separation is useful. Avoid asking existing Starter members to create another account; the dashboard already supports joining with a code. |
| Preparation | Public /onboarding previously fell back to the founding calendar and always offered account creation | Fixed public default-calendar exposure and the account-creation loop. Signed-in cohort calendar values still need instructor review. |
| First useful result | StarterDashboard offers an AI Fit Check, prompt workshop, safety guidance, practice and a task log | Good starting structure. In a participant pilot, observe whether someone can choose a task, create a useful prompt, test it in an approved tool, and explain what they checked without instructor intervention. |
| Returning to work | Prompt workshop is browser-local; cohort session tools save drafts through the account | Workshop already explains this distinction. Preparation checklist now does too. Consider account-backed preparation progress only if cross-device loss is observed; it needs a separate persistence change. |
| Feedback | currentWorkSession prioritizes requested revisions, then in-progress and unstarted work; NextStep links into that work | Strong feedback loop. Preserve revision ownership and stale-save rejection. Existing participant-path tests cover selection behavior. |
| Schedule | Shared defaults still include an old founding-cohort calendar; dashboard logistics say time/venue are awaiting confirmation | Priority: instructor should verify each active cohort's dates and communicate time, time zone and location. Do not delete real participant dates to make the marketing site evergreen. |
| Support | ParticipantHelp uses NEXT_PUBLIC_CONTACT_EMAIL or falls back to replying to an invitation | Priority: configure a real monitored support address for people who have no invitation. Test password-reset delivery and the domain in the delivered link after deployment. |
| Expectations | data/plans.ts comparison says Teams capstone/certificate are included, but its feature list places them under Leadership Programs | Clarify the actual offer before changing entitlements or promises. This pass does not invent plan policy. |
| Organization inquiries | createInquiryAction stores requests for admin review; it does not send an email notification | Assign an owner to review the inbox. Do not assume working reset SMTP means inquiry notifications are sent. |
| Roadmap interaction | HeroRoadmap automatically advances; it pauses on focus/hover and respects reduced motion, but has no explicit pause button | Follow-up: add a persistent pause/play control and validate keyboard and screen-reader use in a real browser. |

## Validation and release limits

- Final TypeScript check passed after all changes.
- Existing cohort and participant-path test files passed (2 files, no failures or skips).
- ESLint passed for the four changed TSX files; git diff whitespace check passed.
- Local HTTP checks passed for /, /onboarding, /start, /register, /login and /plans (all 200). Checks confirmed that visible home-page content has no old cohort marker or founding start date, public preparation omits the default calendar, and invitation/free-start links and the browser-local progress explanation are present. Automated browser interaction, screen-reader behavior and authenticated cohort rendering have not been exercised in this pass.
- The repository's full HTTP smoke script has a known stale whole-admin-page assertion after the addition of the all-accounts manager. Do not treat that script as fully passing.
- cPanel serves committed .next artifacts. Source edits alone do not update the live UI. A successful production build and review of the resulting deployment artifacts are required before release. Do not deploy a dev-server output directory.
- Production build preparation remains blocked by the environment proxy: a fresh request to fonts.googleapis.com returned HTTP 403. The two required font domains were saved in the environment configuration draft during onboarding, but access remains unavailable. Committed .next artifacts were left unchanged.

## How to evaluate participant value next

Run a small observed pilot with a new Starter participant, an invited cohort participant and a returning participant with feedback. Record task completion and points of confusion, without collecting the contents of private work.

1. Can they reach the correct account path without help?
2. Can they produce one useful, checked artifact and identify its limits?
3. Can they leave, return, and locate their saved work or understand what is only browser-local?
4. Can they find instructor feedback, revise and resubmit without losing work?
5. Can they find their confirmed schedule and contact a real person when blocked?

Track submitted-and-reviewed artifacts and participant-reported usefulness alongside completion. Set targets after baseline observations; signup counts alone do not demonstrate participant value.
