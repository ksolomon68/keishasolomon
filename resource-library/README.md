# Participant resources — all eight sessions

Ready-to-upload materials for The AI Executive Sandbox, aligned with the current session curriculum and learning-guide criteria. No fixed start dates. These are participant materials; the existing instructor run sheet in session-materials/session-1 remains separate and unchanged.

## Contents

- Eight six-page participant workbooks, each in printable PDF, editable Word and source Markdown.
- Eight companion plain-text prompt sheets with reusable working templates.
- Three editable CSV templates: timing/quality evidence, a 30-day editorial calendar, and a 30/60/90-day adoption plan.
- UPLOAD-MANIFEST.csv maps the 19 recommended uploads to the session, title and existing Resource Manager type. Word versions are alternatives to the PDFs, not additional required assignments.

| Session | Workbook focus | Companion template |
| --- | --- | --- |
| 1 | Readiness audit and personal assistant | Assistant instructions and readiness evidence |
| 2 | Governance and Safe Harbor policy | Policy outline and scenario checks |
| 3 | Executive triage and measurement | Triage playbook; timing/quality CSV |
| 4 | Automation and recovery | Pipeline handoff and failure tests |
| 5 | Brand voice and content | Voice playbook; editorial calendar CSV |
| 6 | Prototype and usability | Prototype brief and task-test record |
| 7 | Capstone and adoption | Stakeholder package; adoption plan CSV |
| 8 | Showcase and follow-through | Five-minute demo outline and peer feedback |

## Upload into the Resource Manager

1. Unzip the downloaded pack on your computer. The Resource Manager accepts individual files, not the ZIP itself.
2. In the instructor dashboard, select the intended cohort, then open Resource Manager.
3. For each row in UPLOAD-MANIFEST.csv, choose its session, copy its title, select its type and upload its file. `guide` is displayed as **Lab guide**, `prompt_sheet` as **Prompt sheet**, and `template` as **Template**.
4. Upload either the PDF workbook or its Word alternative. If participants need both, use distinct titles ending in “printable PDF” and “editable Word”. Prompt sheets and CSVs remain editable.
5. Choose **Share with every cohort** only for these generic blank materials when you want all cohorts to have them. Completed participant work belongs in the submission flow, not the shared resource library.
6. Verify the file using an authorized participant account in the intended cohort. Check session placement and download behavior before telling participants it is available.

## Automatic publication for every cohort

The cPanel deployment script runs `scripts/publish-shared-resources.cjs` before activating the release. It verifies `catalog.json` and file checksums, copies the 27 participant assets into persistent `UPLOAD_DIR`, and inserts resource records with `cohort_id=NULL`. This makes the pack available to every current and future cohort without per-cohort uploads. The 27 items include both PDF and editable Word workbooks, the eight prompt sheets and the three CSV templates; Markdown sources and instructor notes are not published.

The publisher requires existing application tables and an instructor account. It does not create users or change participant data. Stable resource IDs and a database lock prevent duplicate batches; all metadata is committed together or rolled back. Existing resource records, including instructor edits, are left alone. A retried batch verifies and reuses any files copied before a database failure. Intentional removal of a bundled resource will be reversed by the next automatic publication; set `PUBLISH_SHARED_RESOURCES=0` in the server environment to disable it before making permanent removals. Revising a source file does not overwrite an already-published resource; publish revisions explicitly rather than silently changing instructor materials.

This has been validated locally with the catalog and transaction tests, not against the live cPanel database. Copying the files into Git does not itself publish them: deployment must execute successfully. To run publication separately from the app directory using its active Node environment: `node --env-file=.env.local scripts/publish-shared-resources.cjs`. This script runs directly and does not depend on rebuilding Next.js.

## Facilitation notes

The seven submission workbooks match Sessions 1–7. Session 8 is a presentation/reflection guide, not an eighth deliverable. Examples and numbers are clearly fictional or illustrative; participants must supply their own evidence. A simulation must be labeled as such. Timing must include preparation, AI execution, review and correction. The CSVs contain blank fields, not fabricated results. The editorial calendar spans 30 days but does not require daily publishing. Calculate trial totals and net savings from the named columns; there are no embedded spreadsheet formulas or macros.

The worksheets mention the new one-request course-coaching flow. Deploy that feature before publishing the pack, or revise the coaching paragraph to match the live workflow. Existing Google Calendar appointments require manual reconciliation before confirming a request. Completed worksheets do not automatically establish organizational approval or certificate eligibility.

The PDF layout uses embedded fonts and has been checked for page count and selectable text. It is not certified as a tagged accessible PDF; provide Word or plain-text/Markdown alternatives for participants who need them.

## Regenerate after curriculum changes

Requires the repository's installed `tsx`, Python `python-docx`, `reportlab`, and DejaVu Sans TrueType fonts at `/usr/share/fonts/truetype/dejavu/`.

From the repository root:

```bash
node --import tsx --input-type=module - <<'JS'
import { sessions } from './data/cohortData.ts';
import { learningGuides } from './data/learning-guides.ts';
import { writeFileSync } from 'node:fs';
writeFileSync('/tmp/sandbox-resource-curriculum.json', JSON.stringify({sessions, learningGuides}));
JS
python scripts/generate-session-resources.py /tmp/sandbox-resource-curriculum.json
```

The generator overwrites only its named generated resources and manifest. Review authored exercises in the generator as well as curriculum changes, then recheck the PDFs before distribution. Existing session-materials/session-1 files are preserved.
