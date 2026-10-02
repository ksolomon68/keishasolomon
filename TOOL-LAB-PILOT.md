# Internal Applied Tool Labs

All five tools run inside the participant dashboard. They use original templates and transparent calculations. No external tool redirects, embeds, or subscriptions are required.

Each tool lives inside its session assignment, between preparation and submission. Tools navigation provides shortcuts to the same instance, in session order.

- Session 1: Assistant Selection Planner creates an editable, needs-based selection plan.
- Session 3: Workflow Planner records triggers, permitted inputs, rules, success criteria, human review, ownership, and recovery; it creates an editable playbook with a test record. It does not execute workflows.
- Session 4: Lead Priority Tracker checks fictional inquiries and duplicates, shows transparent scores, and tracks follow-up. Its scores are teaching heuristics.
- Session 5: Content Draft Studio creates editable LinkedIn, Instagram, and email templates from participant input. It does not publish content or operate an AI model.
- Session 7: Capstone Outcome Tracker records baseline, frequency, trial effort, quality, and an adopt/revise/stop decision for reuse in Session 8. All four time stages count; zero and negative savings remain visible. Weekly impact is an estimate.

Every tool has an explicit Save draft action and saved/unsaved status. Drafts are private, scoped to the authenticated account, and stored by session in MySQL or the local JSON backend. Saving does not submit evidence or change deliverable status. Participants download results and attach them to the existing submission for instructor review.

Optimistic versions reject saves from stale tabs, including simultaneous first saves. Failed saves keep the current draft and offer a JSON backup. A pending save marks only its snapshot as saved; edits made while saving stay unsaved. Reloading or leaving can discard unsaved changes, so save before navigating. A browser unload warning protects ordinary page exits; application navigation does not always trigger that warning.

Deployment runs the repeatable, additive scripts/migrate-tool-drafts.cjs before activating the new release. It creates only tool_drafts; failure stops activation. New installations also get this table through npm run db:migrate. User deletion cascades to their drafts in MySQL and removes them in the file backend.

Validation: automated checks cover existing cohort behavior, draft reload/isolation/races, validation limits, mocked MySQL locking/rollback, deployment ordering, and outcome calculations. Browser checks use fictional local accounts. Production database connectivity and migration permissions require the actual cPanel deployment; no live MySQL connection was used during development.

Test with representative participants before claiming measured cohort outcomes.
