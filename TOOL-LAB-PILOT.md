# Internal Applied Tool Labs

All five tools run inside the participant dashboard. They use original templates and transparent calculations. No external tool redirects, embeds, or subscriptions are required.

Each tool lives inside its session assignment, between preparation and submission. Tools navigation provides shortcuts to the same instance, in session order.

- Session 1: Assistant Selection Planner creates an editable, needs-based selection plan.
- Session 3: Workflow Planner records triggers, permitted inputs, rules, success criteria, human review, ownership, and recovery; it creates an editable playbook with a test record. It does not execute workflows.
- Session 4: Lead Priority Tracker checks fictional inquiries and duplicates, shows transparent scores, and tracks follow-up. Its scores are teaching heuristics.
- Session 5: Content Draft Studio creates editable LinkedIn, Instagram, and email templates from participant input. It does not publish content or operate an AI model.
- Session 7: Capstone Outcome Tracker records baseline, frequency, trial effort, quality, and an adopt/revise/stop decision for reuse in Session 8. All four time stages count; zero and negative savings remain visible. Weekly impact is an estimate.

Every tool has an explicit Save draft action and saved/unsaved status. Drafts are private, scoped to the authenticated account, and stored by session in MySQL or the local JSON backend. Saving does not submit evidence or change deliverable status. Participants download results and attach them to the existing submission for instructor review.

Participants can separately choose Share saved results with instructor in each tool. A result snapshot is stored in tool_results; subsequent draft edits do not update it. Share updated results replaces that snapshot, and Stop sharing results withdraws it while preserving the draft. Incomplete results cannot be shared. The Lead Priority Tracker shares completed leads, excluding its unfinished entry form.

The instructor command center opens with Participant results for the selected cohort. It includes every participant (including those who have not shared), search and session filters, sharing counts, capstone measurements and decisions, expandable result details, text downloads, and a refresh link. Capstone timing includes all four effort stages and retains losses; fewer than three trials is marked preliminary. Timings are participant-reported and weekly impact is estimated. No savings total is aggregated across unlike tasks. Full session submission review remains in the roster.

Optimistic versions reject saves from stale tabs, including simultaneous first saves. Failed saves keep the current draft and offer a JSON backup. A pending save marks only its snapshot as saved; edits made while saving stay unsaved. Reloading or leaving can discard unsaved changes, so save before navigating. A browser unload warning protects ordinary page exits; application navigation does not always trigger that warning.

Deployment runs the repeatable, additive scripts/migrate-tool-drafts.cjs before activating the new release. It creates tool_drafts and tool_results separately; failure stops activation. Its shared-host memory/thread limits and database timeouts are retained. New installations also get these tables through npm run db:migrate. User deletion removes their drafts and shared results in both backends.

Validation: automated checks cover existing cohort behavior, draft reload/isolation/races, validation limits, mocked MySQL locking/rollback, deployment ordering, and outcome calculations. Browser checks use fictional local accounts. Production database connectivity and migration permissions require the actual cPanel deployment; no live MySQL connection was used during development.

Test with representative participants before claiming measured cohort outcomes.
