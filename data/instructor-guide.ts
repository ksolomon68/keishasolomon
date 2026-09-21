/**
 * Facilitation content for the instructor booklet at /admin/guide.
 * Everything a participant already sees (agenda, labs, criteria, discussion cases, capstone steps) is read
 * from the other data files so the two never drift. This file only holds what an instructor needs on top:
 * how to run each block and what to watch for. Suggestions, not scripts: adapt them to the room.
 */

export interface SessionFacilitation {
  /** Facilitator prep before the day, specific to this session's hook and lab. */
  prep: string[];
  /** Steps for running the hook (about ten minutes of the concept block). */
  runHook: string[];
  /** The one idea participants should leave with. */
  keyMessage: string;
  /** What to look for while circulating during the build lab. */
  coach: string[];
  /** Prompts for pairs to attack each other's work in peer review. */
  stressTest: string[];
}

export const sessionFacilitation: Record<string, SessionFacilitation> = {
  s1: {
    prep: [
      "Pick one everyday task and write an invented input for it. Prepare two prompts for the same task: a bare one-liner and a structured brief (role, context, constraints, output format, ask-a-question-first). Run both beforehand so you know where the outputs differ.",
      "Decide how the room will judge the duel: accuracy, missing facts, and minutes to fix. Have the screen and a timer ready.",
      "Read the friction logs in the instructor view so you can steer examples toward what the cohort actually struggles with. Never read a private entry aloud with a name attached.",
    ],
    runHook: [
      "Show the task and the invented input. Say what a good result would look like before running anything.",
      "Run the bare prompt live. Read the output aloud and have the room call out errors and gaps.",
      "Run the structured brief on the same input and put the two outputs side by side.",
      "Ask what changed: the model, or the instructions? Name the parts of a strong brief (context, role, constraints, feedback loop) and tie each to something they just saw.",
    ],
    keyMessage:
      "Output quality follows the quality of the brief, and you only know that by measuring against a baseline.",
    coach: [
      "Tasks that are too big (“run my inbox”). Narrow to one task, one owner, one frequency.",
      "Real customer, employee or financial data in a prompt. Stop the exercise and swap in invented data (Safe Harbor).",
      "A baseline that is a feeling, not a number. The audit is not done until current minutes per task are recorded.",
      "Prompts that ask the AI to agree with the plan. Point them to the challenge prompt: weakest assumption, evidence that would change the decision, smallest test.",
    ],
    stressTest: [
      "Give your partner's brief an input with a fact missing. Does it ask a question or invent an answer?",
      "Name the weakest assumption in their time-saving claim. What would they measure to check it?",
      "Swap in a different invented example. Does the brief still hold?",
    ],
  },
  s2: {
    prep: [
      "Write five or six invented “employee prompts”, each hiding at least one problem: client data pasted in, a proprietary formula, copyrighted text, a biased screening instruction, an output that only works if you can see colour. Keep an answer key.",
      "Remind yourself this session produces a draft policy. Participants still need their own organization's approval, and nothing here replaces legal or compliance review. Say so out loud.",
      "Have a one-page policy skeleton ready to project: scope and owner, allowed, prohibited, ask-first, required human checks, approval status and review date.",
    ],
    runHook: [
      "Pair people up and hand out the mock prompts. Each pair marks every leak, trap and bias they can find.",
      "Reveal your answer key one prompt at a time. Tally which traps the room caught and which slipped through.",
      "Ask what rule would have stopped the one most people missed. That rule is the first line of the policy sprint.",
    ],
    keyMessage:
      "A playbook describes a task; it does not grant permission. Keep instructions, tool access and human approval as three separate decisions.",
    coach: [
      "Policies that ban everything (unusable) or say nothing specific (unenforceable). Ask for one concrete allowed, one prohibited and one ask-first example.",
      "A missing owner or approval status. Every policy needs a named approver, an approval status and a next review date.",
      "Confusing instructions with permission when a connector offers account access. Send them to the discussion case below.",
      "Sector-specific rules (regulated settings, client contracts) that need a specialist. Note it as an open question for organizational approval instead of guessing.",
    ],
    stressTest: [
      "Apply your partner's policy to a routine task. Is the answer clear and quick?",
      "Apply it to a sensitive-data request. Where does the policy say no, and who do they ask?",
      "Apply it to an uncertain case. Does it escalate to a named role?",
    ],
  },
  s3: {
    prep: [
      "Prepare a small set of invented messy inputs: an agenda, meeting notes with a missing owner, and an email with two conflicting deadlines. Include one truly ambiguous request.",
      "Do the triage by hand once and time it, so you can model an honest baseline before running the assistant.",
      "Bring index cards or a shared sheet for the Tedium Audit. Tasks can be anonymous.",
    ],
    runHook: [
      "Everyone writes down their single most annoying repetitive task. No names needed.",
      "Read a handful aloud (with permission) and sort them as a room: worth automating, needs a person, or should simply stop.",
      "Pick one and solve it live with the class watching the instructions, not just the output.",
    ],
    keyMessage:
      "Time the whole task, including human correction. Keep a workflow only if quality and effort justify it.",
    coach: [
      "Savings that are assumed, not timed. Ask for before and after minutes, with review time included.",
      "Assistants inventing owners or deadlines. Add a missing-data rule (“mark as not specified”) and retest.",
      "Expecting the tool to “just remember.” Have them save an explicit, versioned playbook and confirm the current instructions are loaded in a fresh task.",
      "Only one test input. Require a routine, a missing-information and a conflicting case.",
    ],
    stressTest: [
      "Give your partner's assistant a request with no owner. What does it do?",
      "Give it two conflicting deadlines. Does it flag the conflict or quietly pick one?",
      "Ask who approves and acts on the final list. Is the hand-off clear?",
    ],
  },
  s4: {
    prep: [
      "Build the demo in a test workspace with invented data: form, sheet, draft reply. Confirm that nothing in it can send a real message or change a real record.",
      "Prepare a manual simulation (paper flow or a spreadsheet walk-through) for anyone whose tools or accounts don't allow automation. The learning is in the design, not the software.",
      "Prepare a valid submission, an invalid one and a duplicate, so you can show what happens to each.",
    ],
    runHook: [
      "Run the intake live: submit a form and watch the record, the draft reply and the routing appear.",
      "Break it on purpose with an invalid email and a duplicate. Show what the pipeline does with each.",
      "Ask: how do you know it worked? Open the destination and check, instead of trusting the summary.",
    ],
    keyMessage:
      "An assistant saying it worked is not proof. Check the destination, keep a human approval point and know how to pause.",
    coach: [
      "Connecting real accounts or records. Move them to a test workspace or manual simulation.",
      "No approval step before an external action. The exact draft must be approved by a person first.",
      "No pause or rollback procedure. Ask what they would do if it misfires at 2 a.m.",
      "Untested edge cases. Require valid, invalid, duplicate and partial-failure evidence.",
    ],
    stressTest: [
      "Submit a valid, an invalid, a duplicate and a partly failing input. Can your partner tell what happened without your help?",
      "Follow their pause instructions cold. Where do you get stuck?",
      "Ask which action would be hardest to undo, and what stops it running without approval.",
    ],
  },
  s5: {
    prep: [
      "Prepare one short piece in three versions: human-written, generic AI, and voice-calibrated AI. Use your own writing or invented text. Number them and keep the key private.",
      "Have a sample voice playbook ready (audience, pillars, do and don't examples, phrases to avoid) to show the level of specificity you expect.",
      "Decide up front that nothing gets published live in class. Scheduling steps are simulated unless a participant has explicit approval.",
    ],
    runHook: [
      "Show the three versions without labels. Have the room vote for the one they think is genuine.",
      "Reveal the key. Ask what gave each one away.",
      "Ask which version was most accurate, not most convincing. Voice and truth are separate checks.",
    ],
    keyMessage:
      "A convincing voice can make an unsupported claim more misleading. Check voice and facts separately, and have a human approve the exact version.",
    coach: [
      "Voice playbooks built from generic adjectives (“warm, professional”). Ask for a do and a don't example of each trait.",
      "Statistics or testimonials nobody supplied. Remove or verify before anything is approved.",
      "Skipping the human editor. Checks cover source support, permissions, voice, links and accessibility.",
      "Calendars with no owner or status. Each item is draft, approved or scheduled, and someone owns it.",
    ],
    stressTest: [
      "Find one claim in your partner's draft with no source. Would their editor checklist have caught it?",
      "Check alt text and links. Would the post work for someone using a screen reader?",
      "Ask which version was approved, by whom, and where that exact text is saved.",
    ],
  },
  s6: {
    prep: [
      "Pick an invented idea (a feedback portal, an event guide) and rehearse the 20-minute build so you know where tools stall.",
      "Have a phone and a keyboard-only test ready to demonstrate the usability check.",
      "Prepare a short list of things a prototype in this room must not do: collect real data, submit real registrations, make promises to real customers.",
    ],
    runHook: [
      "Take an idea from conversation to a clickable mockup in about twenty minutes, narrating each scoping choice out loud.",
      "Stop at one working path. Say what you deliberately left out.",
      "Hand it to someone who hasn't seen it and ask them to complete the task without explanation. Watch where they hesitate.",
    ],
    keyMessage:
      "Build one path, watch someone use it, fix the first confusion. A prototype demonstrates an idea; it is not a finished product.",
    coach: [
      "Feature creep (a chatbot, extra pages) before the core task works. Bring them back to one visitor, one goal, three steps.",
      "Prototypes that collect real data. Make what is simulated visible on the page.",
      "Polish over usability. Ask what the tester tried first.",
      "Missing error and empty states. Success is the easy part.",
    ],
    stressTest: [
      "Give your partner the task with no explanation. Note the first hesitation.",
      "Try it on a phone. Try it with the keyboard only.",
      "Ask what happens when something goes wrong. Is there a way back?",
    ],
  },
  s7: {
    prep: [
      "Plan the pitch rounds for your headcount: groups of three work well (two-minute pitch, one-minute challenge, rotate). Put a timer on the screen.",
      "Prepare a signup sheet for one-on-one troubleshooting during Capstone Polish.",
      "Read every participant's submitted work first. Know who needs the most help with evidence and who is ready to be pushed.",
    ],
    runHook: [
      "Model a two-minute pitch on an invented project: problem, solution, evidence, remaining risk.",
      "Put one weak spot in it on purpose. Ask the room to find it.",
      "Set the round rules: strict timer, one challenge per pitch, nobody defends. The pitcher just writes the challenge down.",
    ],
    keyMessage:
      "A capstone should help someone decide whether to adopt, revise or stop a workflow. Report the full result, not the best trial.",
    coach: [
      "Only the fastest trial shown. Ask for comparable trials and the full effort, including review.",
      "Future savings stated as fact. Label them a hypothesis and define the test.",
      "No owner in the 30-60-90 plan. Every stage needs a named person and a decision.",
      "Overbuilt decks and underbuilt evidence. Send them back to baseline, method and sample count.",
    ],
    stressTest: [
      "What is the true review effort, in minutes, per use?",
      "What is the weakest assumption behind the result?",
      "Which trial hurt the numbers, and did you include it?",
    ],
  },
};

/** Session 8 is a ceremony, not a build lab, so it has its own shape. */
export const showcaseFacilitation = {
  prep: [
    "Confirm the running order and timing with participants a week ahead, and ask whether they are comfortable being photographed or recorded before you do either.",
    "Put a visible timer on screen and agree a hard stop for each demo. Decide who signals time, and how.",
    "Check who has finished every capstone step in the instructor view so certificates are ready for the people who have earned them (see the readiness count in this chapter).",
    "Set up the peer awards: nominations open during the demos, a short ballot afterwards. Categories from the programme: Biggest Time Saver, Most Creative Automation, Best Governance Champion. Add your own if the cohort suggests them.",
  ],
  opening: [
    "Welcome people and name what the room has done: eight months, working assets, real measurements.",
    "Explain the demo format once: problem, solution, measurable impact, in five minutes.",
    "Ask the audience to listen for scalability, governance and sustainability. Those are the peer feedback themes.",
  ],
  demoFormat: [
    "Problem: the operational problem in one or two sentences.",
    "Solution: what they built, shown working (or as a walk-through if a live demo is risky).",
    "Measured impact: baseline, result and what it took to review, including anything that did not work.",
    "Decision: adopt, revise or stop, and the first step in their 30-60-90 plan.",
  ],
  peerFeedback: [
    "What would make this easier to scale to a second team?",
    "Where would governance or approval need to be stronger?",
    "What would keep this working six months from now?",
  ],
  futureProofing: [
    "Do not predict tools. Ask what each person will re-test when the tools they rely on change.",
    "Have every participant name one review habit (a monthly re-test, an owner, a checklist) that outlasts today's setup.",
    "Close the loop with the 30-60-90 plans: who will check in with whom, and when?",
  ],
  closing: [
    "Read the awards, then present certificates. Certificates unlock in the platform once every capstone step is complete.",
    "Thank the cohort, remind them where their work and evidence live, and tell them how to reach you afterwards.",
  ],
} as const;

/** How to run each block of the 90-minute session, keyed by the block titles in `data/cohortData.ts`. */
export const blockPlaybook: Record<string, { move: string; watch: string }> = {
  "The Brag Board": {
    move: "Open with wins. Invite two or three people to share what they built or measured since last time, what broke and how they fixed it. About ninety seconds each. Normalize troubleshooting out loud.",
    watch: "Anyone who is stuck and quiet. Note them for the build lab. Keep it to ten minutes; the lab is where the value is.",
  },
  "Interactive Concept & Executive Framework": {
    move: "Run the hook first (about ten minutes), then teach the month's framework by asking before telling. Keep slides to a minimum and tie every idea to a task from the cohort's friction logs.",
    watch: "Lecturing. If you have talked for five minutes without a question or a task, stop and ask the room to do something.",
  },
  "The Build Lab": {
    move: "Everyone builds on their own laptop. Announce the three steps and their timing (about 10, 15 and 10 minutes). Ask for a hand up at each checkpoint so you know who is behind.",
    watch: "Real, sensitive data in a prompt (stop and swap it for invented data), and people waiting silently for help.",
  },
  "Peer Review & Stress Testing": {
    move: "Pairs swap laptops and try to break each other's work with the stress-test prompts. Roughly six minutes each way, then a short debrief: what broke, what will you change?",
    watch: "Polite pairs. The point is to find failures. Model a good, kind challenge.",
  },
  "Next Month Challenge & Adjourn": {
    move: "State the milestone in one sentence: what to submit, which capstone step is due, and to keep logging friction. Point to the deliverable hub. Finish on time.",
    watch: "Vague homework. Name the exact deliverable and the date.",
  },
  "Welcome & Opening Remarks": {
    move: "Reflect on the programme and introduce the format and the feedback themes for the demos.",
    watch: "Running long. The demos are the main event.",
  },
  "Capstone Lightning Demos": {
    move: "Five minutes each, strictly timed: problem, solution, measured impact. One or two peer questions maximum, then move on.",
    watch: "Overruns. Hold the timer firmly and kindly. Save discussion for the roadmap block.",
  },
  "Future-Proofing & Strategic AI Roadmap": {
    move: "Facilitate a short discussion on sustaining experimentation, focused on re-testing habits and owners rather than predicting products.",
    watch: "Hype. Bring it back to what each person will actually do next.",
  },
  "Peer Awards & Graduation": {
    move: "Announce the cohort-voted recognitions, present certificates to those who have completed every capstone step and close.",
    watch: "Anyone who has not finished their capstone. Speak with them privately beforehand about what happens next.",
  },
};

/** Principles for the front matter, tied to the programme's own pillars. */
export const facilitationPrinciples = [
  {
    title: "Do, then explain",
    body: "Participants build on their own laptops in every session. Put the hook before the framework, and let people try before you tell them why.",
  },
  {
    title: "Make failure cheap and visible",
    body: "Peer review is there to break things. Reward the person who finds a flaw and the person who fixes one.",
  },
  {
    title: "Measure honestly",
    body: "Insist on baselines, sample counts and review time. An outcome of “we should not scale this” is a legitimate result.",
  },
  {
    title: "Keep it safe",
    body: "Invented or sanitized data only. Private friction entries and submissions are never shared with the group.",
  },
] as const;

/** Standing before and after checklists, applied to every session chapter. */
export const beforeSession = [
  "Confirm the session time, time zone and venue with participants. The platform holds dates but not times or locations yet.",
  "Publish this session's prompt sheets, slides and templates in the Resource manager for this cohort.",
  "Read the friction log summary in the instructor view and pick two or three examples for the room (no names).",
  "Review any submitted work from the previous session and send feedback before you meet.",
] as const;

export const afterSession = [
  "Mark attendance in the instructor view.",
  "Review submitted deliverables against the criteria and save feedback: a strength, what to improve, one concrete next step.",
  "Note who was stuck in the lab and follow up within the week.",
  "Add anything you learned to next session's plan, and update the cohort's dates if they moved.",
] as const;

/** Guidance for giving feedback in the instructor view. */
export const feedbackProtocol = {
  formula: [
    "Name a specific strength.",
    "Say what to improve and why it matters.",
    "Give one concrete next step the participant can do this week.",
  ],
  decisions: [
    { label: "Needs revision", when: "One or more criteria are missing or unclear. Always include the next step." },
    { label: "Reviewed", when: "The work meets the session's criteria. Feedback still names one thing to carry forward." },
  ],
  rules: [
    "You can only review work that has a link or a file attached.",
    "Feedback is tied to the revision you reviewed. If a participant changes the evidence or notes, the work returns for review.",
    "The platform cannot see edits inside a linked document. Ask participants to describe changes in their progress notes and resubmit.",
    "If two people review at once, the second save is refused. Reload and check the newer version.",
  ],
} as const;
