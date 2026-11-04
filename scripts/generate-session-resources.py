"""Generate editable and printable participant resources from the current curriculum.

First export sessions and learningGuides to JSON (see resource-library/README.md).
Requires python-docx and reportlab. No network, credentials, or publication actions.
"""
import csv
import hashlib
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "resource-library"
curriculum = json.loads(Path(sys.argv[1]).read_text())
pdfmetrics.registerFont(TTFont('ResourceSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('ResourceSansBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

EXERCISES = {
    1: {
        "title": "Readiness audit and personal AI assistant",
        "task": "Choose one recurring task, compare a basic prompt with a structured prompt, then turn the better version into reusable assistant instructions.",
        "cases": [
            "Routine: draft a follow-up from fictional meeting notes with three agreed actions.",
            "Missing information: remove an action owner and one deadline. The assistant must mark them unknown rather than invent them.",
            "Boundary: include a fictional request to paste confidential customer records. Identify a permitted alternative before using a tool.",
        ],
        "example": "Fictional example: Northstar Services needs an action list from made-up notes. A useful result preserves the three source actions, labels a missing owner as 'unassigned', and asks one clarification. No message is sent.",
        "fields": ["My recurring task / user / frequency", "Current method and baseline minutes", "Data I am allowed to use / tool approval", "AI fit: use, use with review, or do not use; why", "Basic prompt / observed weakness", "Structured prompt: role, context, constraints, output, checks", "Assistant instructions / how to reopen them", "Test inputs and outputs / corrections", "Readiness opportunity: effort, value, risk, next decision"],
        "prompt": "Act as a drafting assistant for [role]. Using only the fictional notes below, produce a table of action, owner, deadline, source evidence and unknowns. Preserve names and dates exactly. Never fill missing details from assumptions. Ask up to three clarification questions. Do not send messages or take external actions. Notes: [fictional notes].",
        "challenge": "Remove a deadline from your sample and rerun the prompt. Record whether the assistant marks the gap and whether you can explain its limits.",
    },
    2: {
        "title": "Safe Harbor policy sprint",
        "task": "Use three realistic scenarios to draft a one-page organizational AI policy, then test whether a colleague can follow it.",
        "cases": [
            "A colleague wants to summarize a customer complaint containing personal information in a public chatbot. What must be removed, approved or avoided?",
            "A marketing draft includes a convincing but unsourced customer quote. Decide who verifies it and what happens if it cannot be verified.",
            "An employee asks AI to rank job applicants from their CVs. Identify the employment, privacy and fairness risks and the escalation owner before proceeding.",
        ],
        "example": "Fictional example: Northstar permits brainstorming with invented examples in approved tools, prohibits uploading customer records to public tools, and requires the operations lead to review exceptions. This is an exercise, not legal advice or organizational approval.",
        "fields": ["Policy owner / version / approval status", "Scope: people, tasks and tools covered", "Approved tools and who authorizes access", "Permitted data / prohibited data / uncertain cases", "Human checks and accountable approver", "Disclosure, copyright and accessibility expectations", "Incident: stop, preserve relevant evidence, notify whom", "Exception request and escalation route", "Peer scenario results / revision / approval still needed"],
        "prompt": "Help draft a one-page internal AI usage guide for [fictional organization]. Use only these supplied rules: [rules]. Cover approved tools, permitted and prohibited data, human checks, disclosure, exceptions and incident escalation. Mark missing owners or decisions as 'approval needed'. Do not claim legal compliance. End with three scenarios to test whether the policy is understandable.",
        "challenge": "Ask a peer to decide what to do in one scenario using only your policy. Replace ambiguous wording before seeking organizational approval.",
    },
    3: {
        "title": "Executive triage and time evidence",
        "task": "Build a repeatable triage workspace that turns fictional requests into a checked action list. Measure the complete task, including review.",
        "cases": [
            "Routine: five fictional requests with known owners and deadlines.",
            "Missing information: two requests have no deadline; one has no owner.",
            "Conflict: two notes give different deadlines for the same task. The output must flag the conflict for a person to resolve.",
        ],
        "example": "Illustrative numbers only: a baseline task takes 30 minutes; AI preparation, execution, review and correction total 22 minutes. Net savings are 8 minutes per comparable run. If one run needs 35 minutes, report the 5-minute loss too. Do not treat this example as your result.",
        "fields": ["Task / owner / comparable baseline method", "Priority rules and escalation rules", "Required columns: priority, action, owner, deadline, uncertainty", "Reusable instructions and example of acceptable output", "Where the playbook is saved / version", "Routine, missing-data and conflict test results", "Baseline / preparation / run / review / correction minutes", "Quality errors and what changed", "Adopt, revise or stop; evidence supporting the decision"],
        "prompt": "Triage these fictional requests using only this priority policy: [policy]. Return priority, action, owner, deadline, evidence and uncertainty. Leave missing fields unknown. Flag conflicting instructions for human review; do not resolve them silently. Do not send, schedule, delete or update anything. Requests: [examples].",
        "challenge": "Run three comparable trials. Calculate net savings = baseline minus (preparation + AI run + review + correction). Do not double-count overlapping time. Report quality failures alongside time.",
    },
    4: {
        "title": "Automation pipeline and recovery plan",
        "task": "Build or simulate one intake-to-routing workflow with a clear human approval boundary and a safe response to failure.",
        "cases": [
            "Valid: a fictional intake contains all required fields; create the intended test record and a draft response.",
            "Invalid or duplicate: required email is missing, or the same test request arrives twice. Route to review or identify the existing record.",
            "Partial failure: the record is created but the response step fails. Identify the completed step before retrying so you do not create duplicate records or messages.",
        ],
        "example": "Fictional example: a form creates one sandbox lead row and drafts an acknowledgement. A person approves the exact text before any send. Replaying the same request must not create a second lead. A manual simulation is acceptable when tool access is unavailable; label it honestly.",
        "fields": ["Workflow owner / test, simulation or pilot status", "Trigger / required fields / destination", "Input validation and duplicate identifier", "Trigger -> checks -> draft -> approval -> action -> verification", "Tool connections and minimum permissions", "Human approval point and approved version", "Four test cases: expected / actual / evidence", "Pause procedure / failed-step recovery / safe retry", "Handoff owner / approval required before live use"],
        "prompt": "Design a small test workflow for [fictional intake process]. Map trigger, validation, duplicate detection, draft, human approval, action and destination verification. Show a manual simulation alternative. Include valid, invalid, duplicate and partial-failure test cases. Never imply an external action happened without destination evidence.",
        "challenge": "Give a peer your recovery instructions. Can they identify what already happened and resume safely without your explanation? Record one improvement.",
    },
    5: {
        "title": "Brand voice and 30-day content plan",
        "task": "Create a voice playbook, adapt one supported idea into three channels, and plan a realistic 30-day editorial window without assuming daily publication.",
        "cases": [
            "Voice: compare a generic draft with a version using your own permitted examples and explicit do/don't rules.",
            "Evidence: include an unsupported statistic in a fictional brief. The editor must remove it or label it for verification before approval.",
            "Publication: simulate account, date, time zone and status checks. A drafted item is not a scheduled or published item.",
        ],
        "example": "Fictional example: an invented workshop FAQ becomes a short post, an email draft and an FAQ answer. All three preserve the same supplied facts; no testimonial or performance claim is invented. A six-item schedule across 30 days may be more useful than 30 weak posts.",
        "fields": ["Audience / need / communication goal", "Three content pillars", "Voice traits / do and don't examples / phrases to avoid", "Source idea and verified supporting evidence", "Channel 1 draft / channel 2 draft / channel 3 draft", "Visual brief / rights / alt text", "Human edits: facts, permission, voice, links, accessibility", "30-day window / cadence / owner / draft and approval status", "Simulated or real destination verification / failure handling"],
        "prompt": "Using only [permitted source facts] and this voice playbook [rules], draft a short post, email and FAQ answer for [audience]. Adapt format without changing facts. Flag missing evidence instead of inventing claims or testimonials. Add a visual brief and suggested alt text. These are drafts for human approval; do not publish or schedule them.",
        "challenge": "Have a peer edit one draft against the voice rules. Update the playbook and try a new topic; record whether review becomes easier without reducing accuracy.",
    },
    6: {
        "title": "Prototype brief and usability test",
        "task": "Create one complete interactive path for a specific visitor goal, then improve the first confusing step using observed feedback.",
        "cases": [
            "Success: a visitor completes the intended three-step task without your explanation.",
            "Recovery: an empty required field or invalid input produces a useful error and preserves entered information.",
            "Access: repeat on a phone and with keyboard only. Check labels, focus, readable text and the success message.",
        ],
        "example": "Fictional example: a community workshop interest form uses sample names only and clearly states that it does not create a real registration. A tester misses the primary button; the team changes its label and placement, then repeats the task.",
        "fields": ["Visitor / one goal / explicit non-goals", "Three-step journey and primary action", "Success, empty, error and loading states", "Prototype link or recorded walkthrough", "What is simulated / data not collected", "Task instruction given to tester", "Observed mobile and keyboard behavior", "First confusion / change made / retest result", "Real deployment requirements and responsible owner"],
        "prompt": "Help scope a prototype for [fictional visitor] to accomplish [one goal]. Propose a three-step journey with labels, success/error states and keyboard access. Use invented data only. Make simulated behavior explicit. List launch requirements separately; do not claim the prototype is production ready.",
        "challenge": "Give a tester only the task, not instructions for the interface. Observe where they hesitate. Make one change and repeat before adding features.",
    },
    7: {
        "title": "Capstone evidence and adoption package",
        "task": "Bring your working artifact, measured evidence and limitations together into a stakeholder decision and a 30/60/90-day plan.",
        "cases": [
            "Evidence: compare baseline and assisted work using comparable tasks and count review and correction effort.",
            "Challenge: a peer questions your strongest benefit claim. Show the actual sample count and the weakest observed result.",
            "Adoption: identify who supports the workflow, how it is paused and what result would make you stop or narrow the pilot.",
        ],
        "example": "Illustrative example: three trials suggest an 8-minute saving per comparable task, but one quality defect remains. The recommendation is a limited pilot with a named reviewer, not organization-wide deployment or guaranteed ROI.",
        "fields": ["Problem / intended user / accountable owner", "Working artifact link and operating instructions", "Baseline method / assisted method / sample count", "Observed timing, quality and review evidence", "Assumptions / limitations / unresolved risks", "Peer feedback and what changed", "30 days: owner, experiment and success condition", "60 days: scope, evidence and decision", "90 days: support, review and continuation or stop decision"],
        "prompt": "Act as a skeptical stakeholder reviewer. Given [capstone evidence], separate observations from assumptions. Challenge sample comparability, human review effort, quality and support ownership. Draft a 30/60/90-day pilot plan with named-owner placeholders and explicit success/stop conditions. Do not invent results or approvals.",
        "challenge": "Rehearse a two-minute pitch. Ask a peer to challenge the weakest assumption and document the change you make before the final showcase.",
    },
    8: {
        "title": "Five-minute showcase and next-step guide",
        "task": "Demonstrate the problem, working solution, observed result and next decision in five minutes. Celebrate useful learning, including a well-evidenced decision not to deploy.",
        "cases": [
            "Live demo: use fictional or approved examples and show the actual output and human check.",
            "Fallback: prepare screenshots or a walkthrough in case the tool, connection or account is unavailable.",
            "Challenge: answer a question about limitations, review effort or who will own the workflow after the course.",
        ],
        "example": "Illustrative example: a participant shows one triaged fictional request, the missing-information warning and the human correction. They distinguish measured trial results from estimates and recommend a small pilot with a review date.",
        "fields": ["0:00-0:40 — problem, user and original effort", "0:40-2:40 — show one complete workflow and human check", "2:40-3:40 — measured result, method and sample count", "3:40-4:30 — limitations, governance and ownership", "4:30-5:00 — next decision and concrete ask", "Backup demonstration location", "Peer feedback: strongest evidence / unanswered question", "My next step / owner / review point", "What I will continue, change or stop"],
        "prompt": "Turn this participant-supplied evidence [evidence] into a five-minute demo outline: problem, live workflow, observed result, limitation and next decision. Preserve uncertainty and sample counts. Do not invent savings, testimonials, approvals or certificate eligibility. Suggest a short fallback walkthrough if the live demo fails.",
        "challenge": "Run once with a timer and once using only your fallback. Finish within five minutes and keep one clear action for after the course.",
    },
}

SAFETY = "Use fictional or explicitly approved examples. Do not paste private customer, employee, health or financial records into public AI tools. Follow your organization's tool and data rules. Treat outputs as drafts; a person verifies facts and approves external actions."

manifest = []
OUT.mkdir(exist_ok=True)

def render_docx(pages, target):
    doc = Document()
    section = doc.sections[0]
    section.top_margin = section.bottom_margin = Inches(.65)
    section.left_margin = section.right_margin = Inches(.75)
    normal = doc.styles['Normal']
    normal.font.name = 'Calibri'
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(7)
    for name in ['Title', 'Heading 1', 'Heading 2']:
        doc.styles[name].font.color.rgb = RGBColor.from_string('132A43')
    section.footer.paragraphs[0].text = 'The AI Executive Sandbox | EVOBRAND Concepts | evobrandai.com'
    for i, blocks in enumerate(pages):
        if i: doc.add_page_break()
        for kind, text in blocks:
            if kind == 'title': doc.add_heading(text, 0)
            elif kind == 'h': doc.add_heading(text, 1)
            elif kind == 'sub': doc.add_heading(text, 2)
            else: doc.add_paragraph(text)
    doc.save(target)

def render_pdf(pages, target):
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='ResourceTitle', fontName='ResourceSansBold', fontSize=21, leading=25, spaceAfter=14, textColor=colors.HexColor('#132A43')))
    styles.add(ParagraphStyle(name='ResourceHeading', fontName='ResourceSansBold', fontSize=15, leading=19, spaceAfter=11, textColor=colors.HexColor('#132A43')))
    styles.add(ParagraphStyle(name='ResourceSub', fontName='ResourceSansBold', fontSize=11, leading=14, spaceBefore=7, spaceAfter=5))
    styles.add(ParagraphStyle(name='ResourceBody', fontName='ResourceSans', fontSize=10, leading=14, spaceAfter=9, alignment=TA_LEFT))
    story = []
    for i, blocks in enumerate(pages):
        if i: story.append(PageBreak())
        for kind, text in blocks:
            style = {'title':'ResourceTitle', 'h':'ResourceHeading', 'sub':'ResourceSub'}.get(kind, 'ResourceBody')
            story.append(Paragraph(escape(text).replace('\n','<br/>'), styles[style]))
    def footer(canvas, doc):
        canvas.setFont('ResourceSans', 8)
        canvas.setFillColor(colors.HexColor('#405168'))
        canvas.drawString(45, 26, 'The AI Executive Sandbox | EVOBRAND Concepts | evobrandai.com')
        canvas.drawRightString(567, 26, str(doc.page))
    SimpleDocTemplate(str(target), pagesize=letter, rightMargin=45, leftMargin=45, topMargin=40, bottomMargin=46, title=pages[0][0][1], author='EVOBRAND Concepts').build(story, onFirstPage=footer, onLaterPages=footer)

for session in curriculum['sessions']:
    n = session['number']
    spec = EXERCISES[n]
    guide = curriculum['learningGuides'].get(session['id'])
    folder = OUT / f'session-{n}'
    folder.mkdir(exist_ok=True)
    title = f"Session {n}: {spec['title']}"
    criteria = guide['criteria'] if guide else [
        'The demonstration shows one working task and its human check.',
        'Results distinguish measured evidence from estimates and include review effort.',
        'Limitations, data boundaries and an accountable owner are stated.',
        'A fallback demonstration and a concrete next decision are ready.',
        'The presentation fits five minutes without relying on invented results.',
    ]
    starter = guide['starter'] if guide else '\n'.join(spec['fields'])
    pages = [
        [('title', title), ('p', session['theme']), ('h', 'Your outcome'), ('p', spec['task']),
         ('sub', 'Before you begin'), ('p', guide['prepare'] if guide else 'Bring your capstone artifact, evidence and fallback demo. Use your cohort calendar for timing; this resource has no fixed start date.'),
         ('sub', 'Participant details'), ('p', 'Name: ____________________   Cohort: ____________________\nProject / task: __________________________________________'),
         ('sub', 'Working boundaries'), ('p', SAFETY),
         ('sub', 'What to keep'), ('p', 'Keep a copy of your inputs, outputs, decisions and revisions. Browser-only drafts may not follow you to another device. Upload the completed resource or share a permitted link through your participant dashboard.'),
         ('sub', 'Course coaching'), ('p', 'Each cohort participant may request one remote coaching session during the course. Request it inside the platform; your instructor confirms the time. Use the same conversation for time changes.')],
    ]
    # Explicit construction keeps the learning steps in the curriculum's order.
    lab = [('h', 'Lab guide'), ('p', 'Follow your instructor or work through these steps using approved tools. A document or manual simulation is acceptable when a connected tool is unavailable; label its status honestly.')]
    steps = guide['steps'] if guide else ['Prepare your five-minute outline using the worksheet.', 'Rehearse the working demonstration and its fallback with a timer.', 'Capture peer feedback and name the next decision, owner and review point.']
    for i, step in enumerate(steps, 1):
        lab += [('sub', f'Step {i}'), ('p', step)]
    lab += [('sub', 'Worked example — fictional / illustrative'), ('p', spec['example']), ('sub', 'Try the prompt sheet'), ('p', 'Use the companion prompt sheet as a starting point, replace bracketed fields and test the result. It is not a guarantee of accuracy or an instruction to publish anything.')]
    pages.append(lab)
    # Split the worksheet so printed copies have room to write.
    for start in [0, 5]:
        worksheet = [('h', 'Participant worksheet' + (' — continued' if start else '')), ('p', 'Complete the fields below. Use the editable Word version if you need more space. Label evidence you have not collected yet as unknown.')]
        for field in spec['fields'][start:start+5]:
            worksheet += [('sub', field), ('p', '_______________________________________________________________\n_______________________________________________________________')]
        pages.append(worksheet)
    tests = [('h', 'Test, challenge and improve')]
    for i, case in enumerate(spec['cases'], 1):
        tests += [('sub', f'Test {i}'), ('p', case), ('p', 'Expected result: ______________________________________________\nActual result / evidence: _______________________________________\nCorrection or decision: _________________________________________')]
    tests += [('sub', 'Transfer challenge'), ('p', spec['challenge'])]
    pages.append(tests)
    review = [('h', 'Review and submit'), ('p', 'Mark each criterion ready, needs revision, or not applicable with a reason. An instructor reviews the evidence; completing a worksheet alone does not establish approval or certificate eligibility.')]
    for criterion in criteria:
        review += [('p', '[ ] Ready   [ ] Revise   [ ] N/A — ' + criterion)]
    review += [('sub', 'Submission'), ('p', ('Submit under ' + session['deliverable']['title'] + ' in My work. Include your artifact or permitted link, test evidence and notes about what changed. Save a draft if it is not ready for review.') if session['deliverable'] else 'Session 8 has no separate deliverable upload. Prepare your showcase and update your capstone evidence in the dashboard. Follow the instructor’s presentation instructions.'),
               ('sub', 'Feedback and follow-through'), ('p', 'Feedback received: ____________________________________________\nChange I made: ________________________________________________\nEvidence retested: ______________________________________________\nMy next action / owner / review point: _____________________________')]
    pages.append(review)
    base = f'Session-{n:02d}-Participant-Workbook'
    render_docx(pages, folder / (base + '.docx'))
    render_pdf(pages, folder / (base + '.pdf'))
    md = '\n\n'.join((('# ' if kind == 'title' else '## ' if kind == 'h' else '### ' if kind == 'sub' else '') + text) for page in pages for kind, text in page)
    (folder / (base + '.md')).write_text(md + '\n')
    prompt_name = f'Session-{n:02d}-Prompt-and-Template.txt'
    prompt_text = f'{title}\nTHE AI EXECUTIVE SANDBOX — EVOBRAND Concepts\n\nPURPOSE\n{spec["task"]}\n\nBEFORE YOU PASTE\n{SAFETY}\n\nSTARTER PROMPT\n{spec["prompt"]}\n\nREUSABLE WORKING TEMPLATE\n{starter}\n\nTEST CASES\n' + '\n'.join(f'{i}. {case}' for i, case in enumerate(spec['cases'], 1)) + '\n\nTEST RECORD\nInput / expected output:\nActual output / unsupported claims:\nHuman correction / rule changed:\nTime including preparation, execution, review and correction:\nNext owner and decision:\n\nTRANSFER CHALLENGE\n' + spec['challenge'] + '\n\nSAVE AND REVIEW\nKeep your own copy and follow the workbook submission instructions. Do not include passwords, private records or secret URLs.\n'
    (folder / prompt_name).write_text(prompt_text)
    manifest += [dict(session=f's{n}', title=title + ' — workbook', kind='guide', file=f'session-{n}/{base}.pdf', editable_alternative=f'session-{n}/{base}.docx'), dict(session=f's{n}', title=title + ' — prompt and template', kind='prompt_sheet', file=f'session-{n}/{prompt_name}', editable_alternative='')]

CSV_TEMPLATES = [
    (3, 'Timing-and-Quality-Log.csv', ['Trial','Task and comparable input','Baseline minutes','Preparation minutes','AI run minutes','Review minutes','Correction minutes','Assisted total minutes','Net minutes saved (negative = loss)','Quality errors','Evidence link','Decision'], 'Timing and quality evidence log'),
    (5, '30-Day-Editorial-Calendar.csv', ['Day in 30-day window','Planned date','Time','Time zone','Channel','Audience','Topic and source evidence','Owner','Draft link','Approval status','Approver and version','Scheduled or simulated','Destination confirmation','Follow-up'], '30-day editorial calendar'),
    (7, '30-60-90-Day-Adoption-Plan.csv', ['Milestone','Owner','Experiment or scope','Evidence to collect','Success condition','Stop or revise condition','Review point','Decision and rationale'], '30/60/90-day adoption plan'),
]
for n, name, columns, title in CSV_TEMPLATES:
    target = OUT / f'session-{n}' / name
    with target.open('w', newline='') as handle:
        writer = csv.writer(handle)
        writer.writerow(columns)
        first_cells = list(range(1, 31)) if n == 5 else ['30 days','60 days','90 days'] if n == 7 else list(range(1, 4))
        writer.writerows([[str(first)] + [''] * (len(columns)-1) for first in first_cells])
    manifest.append(dict(session=f's{n}', title=title, kind='template', file=f'session-{n}/{name}', editable_alternative=''))
with (OUT / 'UPLOAD-MANIFEST.csv').open('w', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=['session','title','kind','file','editable_alternative'])
    writer.writeheader()
    writer.writerows(manifest)
catalog = []
for row in manifest:
    variants = [(row['file'], row['title'], row['kind'])]
    if row['editable_alternative']:
        variants.append((row['editable_alternative'], row['title'] + ' (editable Word)', 'template'))
    for file, title, kind in variants:
        data = (OUT / file).read_bytes()
        catalog.append(dict(sessionId=row['session'], title=title, kind=kind, file=file, sha256=hashlib.sha256(data).hexdigest()))
(OUT / 'catalog.json').write_text(json.dumps(catalog, indent=2) + '\n')
print(f'Generated 8 workbooks (PDF, Word and Markdown), 8 prompt sheets and 3 CSV templates in {OUT}')
