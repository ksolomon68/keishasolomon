# Cohort content: source adaptation and validation

## Source used

The user supplied the text **Comprehensive Analysis of AI Productivity and Content Automation Frameworks** after providing a private Notebook link. This is a summary of documentation and transcripts, not the original source documents. The original notebook was not accessed. The content below is adapted from the supplied text; it does not claim independent verification of the notebook's product capabilities, statistics, or business rankings.

## What participants can now do

| Source idea | Cohort application | Evidence participants produce |
| --- | --- | --- |
| Structured communication: role, task, context, constraints, clarification | Prompt builder in the dashboard's Practice section; Session 1 prompt comparison | Reusable brief, paired outputs, corrections, and review time |
| Intellectual sparring | Challenge mode in the builder and decision exercises | Weakest assumption, missing evidence, and a small test |
| Personalized skills and memory | Session 3 reusable playbook | Inputs, examples, rules, owner, version, and last-tested date |
| Human review | Session 2 permissions boundary and Session 5 editorial process | Exact approved version, approver, and required checks |
| Content engine | Session 5 one-idea/three-channel lab | Voice playbook, three drafts, visual brief, and 30-day draft calendar |
| Connected tools and checks | Session 4 staged test pipeline | Minimum access, approval point, failed-input test, and recovery instructions |
| Verify the destination | Sessions 4 and 5 confirmation log | Correct account, time zone, time, identifier, and actual status |
| Practice and iteration | Seven decision exercises with explanations | A better decision and an explicit next experiment |
| Plan before building | Session 6 bounded prototype and Session 7 adoption decision | User task, observed test result, and adopt/revise/stop recommendation |

All worked examples and decision situations are explicitly fictional teaching cases. They are not testimonials or measured cohort outcomes. Prompt building assembles text locally; it does not call an AI service. Exercise choices and unfinished prompt drafts are not saved to participant accounts; the interface explains this and offers copying/downloading.

## Editorial decisions

- Retained the five-part briefing method and added an output format so participants can check results.
- Replaced “top 0.1% expert” and “95% confident” with a specific responsibility, clarifying questions, and evidence. Self-reported model confidence is not a success criterion.
- Replaced “never forgets” with explicit, inspectable playbooks and a check that the current instructions are loaded. Memory features vary by tool.
- Put human review **before** scheduling or publishing. Then verify the destination, rather than treating an assistant's success message as proof.
- Kept the core exercises tool-neutral. The source's Claude/Blotato stack is an example, not a required purchase or an integration installed on this site. Participants can simulate connected steps with documents and a spreadsheet.
- Did not teach the source's monetization tier list as universal business advice, or its 80–90% planning allocation as a measured rule. The applicable lesson is to agree on the task and boundaries before execution.
- Removed unsupported numerical productivity claims from the curriculum and changed the immediate-ROI promise to a measured pilot decision.

## Where the content lives

- `data/learning-guides.ts`: seven preparation briefs, three-step labs, examples, review criteria, starter templates, and practice tasks.
- `data/cohort-practice.ts`: decision cases, answer explanations, the fictional briefing example, and prompt assembly.
- `components/dashboard/prompt-workshop.tsx`: editable brief, challenge option, output, copy/download, and testing instructions.
- `components/dashboard/decision-practice.tsx`: accessible choice controls and feedback.
- `components/dashboard/learning-guide.tsx`: integrates each decision case with its matching module and deliverable.

## Phase 1 status

The authorized changes include the next-action panel, instructor friction view, review feedback tied to revisions, stale-save protection, confirmed-date selection, seven guided deliverables, account-help fallback, pending logistics, and an in-memory onboarding fallback. These were present when the notebook summary was supplied and have now been supplemented with the source-informed practice content.

The remaining operational inputs are the real support email, start time/time zone/venue, and March session date. The interface truthfully marks them as pending or directs invited participants to their welcome message. No values were invented.

Before deploying the feedback changes to an existing MySQL installation, run `npm run db:migrate`. The migration adds `version`, `revision`, `feedback`, and `feedback_revision` without deleting existing rows. MySQL migration and transactional behavior have not been tested against a live database in this work; the isolated file backend and common state rules were tested. Do not migrate a live database merely to run local checks.

Current validation: TypeScript and ESLint pass; five regression tests pass; the optimized production build succeeds in the isolated output directory. HTTP integration tests with fictional accounts pass for actual sign-in, route protection, cross-participant isolation, instructor visibility, unauthorized review rejection, evidence validation, feedback, resubmission, unchanged reviewed saves, edited reviewed work, and stale-save rejection. Browser interaction and a fresh accessibility audit remain unverified because the browser tool connection is unavailable. Earlier audit screenshots are not verification of the newly added controls.

Outcome tracking with persisted before/after measurements remains a Phase 2 proposal. Participants can record measurements in the provided starter templates now; the site does not yet aggregate measured savings.
