# Participant path

The dashboard starts with a next-action recommendation and one open assignment. Both use the same priority: revision requested, unfinished draft, then first new assignment. The assignment uses the cohort's actual schedule dates.

Five navigation choices follow the same page order: My work, Tools, Progress, Schedule, Help. Current work offers Prepare → Use the tool (or Build your brief) → Submit for feedback. Tool results return directly to that session's submission. The shared dashboard link handler opens hidden ancestors, moves keyboard focus, and jumps beneath the sticky navigation. In-page tool state survives these jumps.

All tools remain visibly named in the shortcut library. Interactive tools open within their session assignment, with a Continue to submission action. Both entry points use the same mounted tool instance. Progress details and the full schedule are collapsed until requested. Learning guides, extra assignments, materials, problem logging, coaching, and support remain available. Existing feedback, permissions, submission validation, and account isolation are retained.

Applied the user-requested ui-ux-pro-max skill. The initial disclosure search did not match the task; the narrower navigation search supported avoiding sticky-header obstruction. The five-section hierarchy and current-task emphasis are implementation judgments based on the observed dashboard and participant flow, not measured usability results.

Validation: local fictional participant sign-in, next-action preparation, prompt workspace, tool-to-submission link, mobile jump menu restoring current work, and 375px portrait / 812px landscape overflow checks. Work-step links measured 48px high. Desktop layout was also visually inspected. Priority tests cover revision precedence, unfinished drafts, submitted-work exclusion, and cohort dates. Full screen-reader, text-zoom, reduced-motion emulation, and representative-participant usability testing remain unverified.

Inline-tool follow-up: verified that the library opens a tool within its existing assignment (including assignments inside the collapsed other-work group), Continue to submission opens that session's form, and edited planner text survives going to submission and reopening from the library. Exactly one planner tool instance was present. The 375px inline layout showed no horizontal overflow. Tool content uses the assignment's existing border and spacing rather than another nested card.
