/**
 * Single source of truth for cohort content.
 * Sourced from "Executive AI Leadership Curriculum" (The AI Executive Sandbox version).
 * Edit here and the landing page, dashboard, admin roster and capstone tracker all update.
 */

export const site = {
  name: "The AI Executive Sandbox",
  tagline: "Applied Leadership & Innovation",
  headline: "Applied AI for Leadership & Business Innovation",
  url: "https://keishasolomon.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  format: "8-month cohort · 90-minute in-person sessions",
} as const;

export const instructor = {
  name: "Keisha Solomon",
  company: "EVOBRAND Concepts",
  role: "Lead Instructor",
  summary:
    "Keisha Solomon leads a practical, ethical and accessible approach to AI for local leaders, entrepreneurs and organizational teams: tools that save time and improve operations, taught through live builds instead of lectures.",
} as const;

export const cohortStats = [
  { value: "8", label: "Monthly sessions" },
  { value: "90", label: "Minutes per session" },
  { value: "7", label: "Working assets built" },
  { value: "0", label: "Coding required" },
] as const;

export type Focus =
  | "Mindset & Governance"
  | "Workflow & Automation"
  | "Brand & Prototyping"
  | "Capstone & Launch";

export const focusAreas: Focus[] = [
  "Mindset & Governance",
  "Workflow & Automation",
  "Brand & Prototyping",
  "Capstone & Launch",
];

export interface AgendaBlock {
  start: string;
  end: string;
  minutes: number;
  title: string;
  detail: string;
}

export interface Session {
  id: string;
  number: number;
  /** ISO calendar date (YYYY-MM-DD), or null while the date is still to be announced. */
  date: string | null;
  /** Human label, always populated (used when the date is TBA). */
  dateLabel: string;
  shortDate: string;
  theme: string;
  focus: Focus;
  hook: { name: string; description: string };
  concepts: string[];
  lab: { name: string; description: string };
  /** Null for the final showcase session, which has no separate deliverable. */
  deliverable: { title: string; description: string } | null;
  agenda: AgendaBlock[];
}

/** Standard run-of-show, sessions 1 to 7. */
const standardAgenda: AgendaBlock[] = [
  {
    start: "00:00",
    end: "00:10",
    minutes: 10,
    title: "The Brag Board",
    detail: "Wins and troubleshooting from last month's build.",
  },
  {
    start: "00:10",
    end: "00:35",
    minutes: 25,
    title: "Interactive Concept & Executive Framework",
    detail: "The hook plus the month's strategy, live and unscripted.",
  },
  {
    start: "00:35",
    end: "01:10",
    minutes: 35,
    title: "The Build Lab",
    detail: "Everyone builds the tool live on their laptop.",
  },
  {
    start: "01:10",
    end: "01:25",
    minutes: 15,
    title: "Peer Review & Stress Testing",
    detail: "Pair up and try to break each other's work.",
  },
  {
    start: "01:25",
    end: "01:30",
    minutes: 5,
    title: "Next Month Challenge & Adjourn",
    detail: "The milestone to hit before the next session.",
  },
];

/** Final showcase, 90-minute window. */
const showcaseAgenda: AgendaBlock[] = [
  {
    start: "00:00",
    end: "00:10",
    minutes: 10,
    title: "Welcome & Opening Remarks",
    detail: "Program reflection and introductions.",
  },
  {
    start: "00:10",
    end: "01:10",
    minutes: 60,
    title: "Capstone Lightning Demos",
    detail: "Each participant shows a working AI project: problem, solution, measurable impact.",
  },
  {
    start: "01:10",
    end: "01:20",
    minutes: 10,
    title: "Future-Proofing & Strategic AI Roadmap",
    detail: "Sustaining experimentation and navigating next-generation tools.",
  },
  {
    start: "01:20",
    end: "01:30",
    minutes: 10,
    title: "Peer Awards & Graduation",
    detail: "Cohort-voted recognitions, certificates and credential conferral.",
  },
];

export const sessions: Session[] = [
  {
    id: "s1",
    number: 1,
    date: "2026-10-16",
    dateLabel: "October 16, 2026",
    shortDate: "Oct 16",
    theme: "Executive AI Mindset & Strategic Landscape",
    focus: "Mindset & Governance",
    hook: {
      name: "The Prompt Duel",
      description:
        "Raw, basic instructions go head to head with advanced, persona-driven prompts. The outputs are judged live on screen.",
    },
    concepts: [
      "Generative AI vs. traditional automation: cutting through the hype",
      "The anatomy of a high-leverage prompt: context, role, constraints and feedback loops",
      "Cognitive offloading: identify repetitive mental tasks and measure the time they take",
      "Finding operational bottlenecks and high-impact use cases",
    ],
    lab: {
      name: "Build Your Personal AI Assistant",
      description:
        "Build a personal AI assistant that uses your instructions, preferences and approved examples to help you draft, organize and review everyday work.",
    },
    deliverable: {
      title: "AI Readiness Audit",
      description:
        "A personal AI Readiness & Opportunity Audit for your business or role, plus a Personal AI Assistant configured and tested for email drafting, meeting summaries and decision support, with human review.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s2",
    number: 2,
    date: "2026-11-20",
    dateLabel: "November 20, 2026",
    shortDate: "Nov 20",
    theme: "AI Red-Teaming, Governance, Ethics & Privacy",
    focus: "Mindset & Governance",
    hook: {
      name: "The Security Escape Room",
      description:
        "In pairs, review realistic mock employee prompts and hunt for data leaks, copyright traps and implicit bias.",
    },
    concepts: [
      "Safe harbor rules: protecting customer data, proprietary formulas and internal documents in public models",
      "Ethical implementation and bias mitigation in client-facing and regulated settings",
      "Digital accessibility and fairness: keeping AI-assisted communication inclusive",
      "IP and confidentiality when using third-party models",
    ],
    lab: {
      name: "The Policy Sprint",
      description:
        "Draft a straightforward one-page Safe Harbor AI Guide for internal staff and contractors.",
    },
    deliverable: {
      title: "Safe Harbor Usage Policy",
      description:
        "An executive-approved Organizational AI Usage Policy tailored to your sector: acceptable tools, data boundaries and escalation paths.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s3",
    number: 3,
    date: "2026-12-18",
    dateLabel: "December 18, 2026",
    shortDate: "Dec 18",
    theme: "The 5-Hour Workweek Reclaim & Executive Workflows",
    focus: "Workflow & Automation",
    hook: {
      name: "The Tedium Audit",
      description:
        "Everyone writes down their single most annoying, repetitive task, and the room competes to solve or eliminate it with AI.",
    },
    concepts: [
      "Inbox triage, calendar planning and meeting synthesis",
      "Document dissection: contract extraction, vendor invoice comparison, policy translation",
      "Managing AI output: verifying accuracy, catching hallucinations, fact-checking",
      "Maximizing personal productivity without breaking corporate tool limits",
    ],
    lab: {
      name: "Build an Executive Triage Workflow",
      description:
        "Set up a template that ingests messy agendas, notes or customer emails and returns prioritized action items with deadlines.",
    },
    deliverable: {
      title: "Executive Triage Workspace",
      description:
        "A reusable Triage Assistant template, with before-and-after timing that includes human review and correction.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s4",
    number: 4,
    date: "2027-01-15",
    dateLabel: "January 15, 2027",
    shortDate: "Jan 15",
    theme: "No-Code Automation & Business Pipelines",
    focus: "Workflow & Automation",
    hook: {
      name: "The Zero-Touch Lead",
      description:
        "Watch a client intake form qualify a lead, update records and draft a custom response without a single manual click.",
    },
    concepts: [
      "Trigger-based automation: connecting forms, spreadsheets and email with accessible no-code tools",
      "Layering AI onto legacy workplace tools without expensive overhauls",
      "Routine process optimization: invoicing, customer inquiries, lead qualification",
    ],
    lab: {
      name: "The Mini-Automation Pipeline",
      description:
        "Configure a live automated trigger, such as customer request routing or a follow-up sequence.",
    },
    deliverable: {
      title: "Operational Trigger Pipeline",
      description:
        "An operational automated intake or routing workflow deployed for your business.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s5",
    number: 5,
    date: "2027-02-19",
    dateLabel: "February 19, 2027",
    shortDate: "Feb 19",
    theme: "Brand Authority & Content Engines",
    focus: "Brand & Prototyping",
    hook: {
      name: "The Imposter Test",
      description:
        "Three versions of one article: human-written, generic AI, and voice-calibrated AI. The room votes on which is genuine.",
    },
    concepts: [
      "Thought leadership vs. robotic fluff: infusing lived experience into AI-assisted writing",
      "Multi-modal repurposing: one voice memo becomes a 30-day multi-channel calendar",
      "Using image, voice and video synthesis safely and effectively",
    ],
    lab: {
      name: "Brand Voice Calibration",
      description:
        "Feed past speeches, newsletters or emails into your AI workspace to extract and save a distinctive brand style matrix.",
    },
    deliverable: {
      title: "Brand Knowledge Base & Content Calendar",
      description:
        "A reusable Brand Voice Bible and a draft 30-day editorial campaign, ready to publish.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s6",
    number: 6,
    date: null,
    dateLabel: "March 2027 (Date TBA)",
    shortDate: "Mar TBA",
    theme: "Rapid Prototyping & Web Strategy",
    focus: "Brand & Prototyping",
    hook: {
      name: "Concept to Mockup in 20 Minutes",
      description: "Take an idea from conversation to interactive prototype in real time.",
    },
    concepts: [
      "Demystifying tech builds: AI-generated wireframes, customer portals and landing pages",
      "Customer touchpoints: chatbots, FAQ automation and interactive intake forms",
      "Scoping tech partners: evaluating developer estimates and avoiding overpaying for routine builds",
    ],
    lab: {
      name: "Interactive Asset Build",
      description:
        "Build a live prototype of a customer feedback portal, landing page or interactive event guide.",
    },
    deliverable: {
      title: "Interactive Intake / Prototype Mockup",
      description: "A functional, shareable interactive prototype or digital asset link.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s7",
    number: 7,
    date: "2027-04-16",
    dateLabel: "April 16, 2027",
    shortDate: "Apr 16",
    theme: "Capstone Incubator & Change Management",
    focus: "Capstone & Launch",
    hook: {
      name: "The Shark Tank Dry Run",
      description:
        "Peer-to-peer two-minute pitch rounds to pressure-test every capstone project before graduation.",
    },
    concepts: [
      "Overcoming organizational inertia: guiding hesitant teams through adoption",
      "Measuring ROI: time saved, response times shortened, operational dollars preserved",
      "30-60-90 day deployment roadmaps after the cohort ends",
    ],
    lab: {
      name: "Capstone Polish",
      description:
        "Fine-tune prompt setups, automations and presentation decks with one-on-one troubleshooting.",
    },
    deliverable: {
      title: "Stakeholder Capstone Package",
      description:
        "A completed capstone project and executive AI strategic plan, ready for stakeholder demonstration.",
    },
    agenda: standardAgenda,
  },
  {
    id: "s8",
    number: 8,
    date: "2027-05-11",
    dateLabel: "May 11, 2027",
    shortDate: "May 11",
    theme: "Final Showcase, Project Presentations & Graduation",
    focus: "Capstone & Launch",
    hook: {
      name: "Peer Awards",
      description:
        "Cohort-voted recognitions such as Biggest Time Saver, Most Creative Automation and Best Governance Champion.",
    },
    concepts: [
      "Lightning demos: the operational problem, the solution you built, the measurable impact",
      "Peer feedback on scalability, governance and long-term sustainability",
      "Future-proofing roadmap for next-generation tools",
    ],
    lab: {
      name: "Lightning Presentations",
      description: "Five-minute live demonstrations of each participant's working AI project.",
    },
    deliverable: null,
    agenda: showcaseAgenda,
  },
];

/** Sessions that carry a deliverable (1 to 7). Used by the submission hub and roster. */
export const deliverableSessions = sessions.filter(
  (s): s is Session & { deliverable: NonNullable<Session["deliverable"]> } => s.deliverable !== null,
);

export const sessionById = (id: string): Session | undefined => sessions.find((s) => s.id === id);

export const valueMatrix = {
  pillars: [
    {
      title: "Active over passive",
      body: "No lecturing off slides for hours. Sessions are rapid-fire and experiential, tied to the friction you face at work.",
    },
    {
      title: "Gamified builds",
      body: "Every session has a hook: a duel, an escape room, a pitch round. You learn by doing, and by trying to break each other's work.",
    },
    {
      title: "Useful work, measured results",
      body: "Build a practical asset, test its quality and time cost, and decide whether to pilot it in your business.",
    },
  ],
  rows: [
    {
      dimension: "Session format",
      passive: "Slides and demos you watch",
      sandbox: "Live builds on your own laptop",
    },
    {
      dimension: "Practice",
      passive: "Homework you may never do",
      sandbox: "Peer stress-testing inside the session",
    },
    {
      dimension: "Content",
      passive: "Generic tool tours",
      sandbox: "Your workplace friction log drives the labs",
    },
    {
      dimension: "Monthly outcome",
      passive: "Notes and a certificate",
      sandbox: "A working asset: policy, workflow, pipeline or prototype",
    },
    {
      dimension: "Risk",
      passive: "Real data pasted into public models",
      sandbox: "Sanitized data and safe harbor rules from day one",
    },
  ],
} as const;

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  group: "bring" | "accounts";
}

export const onboardingChecklist: ChecklistItem[] = [
  {
    id: "laptop",
    group: "bring",
    title: "Your laptop and charger",
    detail:
      "Every session is an interactive build lab. Tablets and phones alone don't give you enough flexibility for the exercises.",
  },
  {
    id: "friction-log",
    group: "bring",
    title: 'A "Workplace Friction" log',
    detail:
      "Track repetitive, time-consuming tasks such as inbox triage, recurring communications, agendas or data re-entry. The labs target these directly. You can keep it right in your participant dashboard.",
  },
  {
    id: "ai-account",
    group: "accounts",
    title: "A primary AI account: ChatGPT and/or Claude",
    detail:
      "A free or Plus/Pro account works. A paid plan unlocks advanced reasoning models, project workspaces and custom agents, but isn't required for Day 1.",
  },
  {
    id: "google-account",
    group: "accounts",
    title: "A Google account",
    detail: "Used for shared cohort resources, session prompt sheets and collaborative templates.",
  },
  {
    id: "workplace-tools",
    group: "accounts",
    title: "Access to your everyday business tools",
    detail:
      "Word/Excel, Google Docs/Sheets or your email client, so you can plug what we build straight into your daily flow.",
  },
];

export const safeHarbor = {
  title: "Confidentiality & Safe Harbor Pledge",
  intro:
    "You will never be asked to put proprietary customer records, confidential health details or private financial accounts into unapproved public models during class.",
  commitments: [
    {
      title: "Confidentiality first",
      body: "No live exercise requires real proprietary data. If it isn't yours to share, it stays out of the model.",
    },
    {
      title: "Sanitized data, always",
      body: "You'll learn to sanitize documents and build custom guardrails, so organizational compliance and privacy standards stay intact.",
    },
    {
      title: "Your work stays yours",
      body: "Your friction log, submissions and progress are visible to you and authorized instructors. Other participants cannot view your private work on this platform.",
    },
  ],
} as const;

export interface CapstoneStep {
  id: string;
  title: string;
  detail: string;
  /** Session by which this step should be done. */
  bySessionId: string;
}

/** Step-by-step path to the May 11, 2027 lightning presentations. */
export const capstoneSteps: CapstoneStep[] = [
  {
    id: "pick-problem",
    title: "Choose your capstone problem",
    detail:
      "Pick the highest-impact item from your Workplace Friction log and Readiness Audit. One problem, clearly stated.",
    bySessionId: "s1",
  },
  {
    id: "baseline",
    title: "Capture your baseline",
    detail: "Record how long it takes and what it costs today, so your ROI is measurable later.",
    bySessionId: "s2",
  },
  {
    id: "guardrails",
    title: "Apply your Safe Harbor guardrails",
    detail: "Define which data the capstone may touch and which it never will.",
    bySessionId: "s2",
  },
  {
    id: "workflow-v1",
    title: "Build a first working version",
    detail: "Use your triage workspace or prompt suite to solve the core of the problem end to end.",
    bySessionId: "s3",
  },
  {
    id: "automate",
    title: "Automate the hand-offs",
    detail: "Wire triggers, routing or follow-ups so the solution runs with minimal manual effort.",
    bySessionId: "s4",
  },
  {
    id: "voice-comms",
    title: "Draft your communication assets",
    detail: "Use your Brand Voice Bible to write the announcement, training note or client message.",
    bySessionId: "s5",
  },
  {
    id: "prototype",
    title: "Prototype the customer or team touchpoint",
    detail: "Mock up the intake page, portal or guide people will actually use.",
    bySessionId: "s6",
  },
  {
    id: "dry-run",
    title: "Survive the Shark Tank Dry Run",
    detail: "Deliver a two-minute pitch and capture peer feedback.",
    bySessionId: "s7",
  },
  {
    id: "roi-roadmap",
    title: "Measure ROI and write your 30-60-90 plan",
    detail: "Time saved, response times, dollars preserved, plus your post-cohort rollout roadmap.",
    bySessionId: "s7",
  },
  {
    id: "package",
    title: "Assemble the Stakeholder Capstone Package",
    detail: "Bundle the solution, guardrails, ROI evidence and roadmap for stakeholder review.",
    bySessionId: "s7",
  },
  {
    id: "lightning",
    title: "Rehearse your 5-minute lightning demo",
    detail: "Problem, solution, measurable impact. Time it, then time it again.",
    bySessionId: "s8",
  },
];

export const deliverableStatuses = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "submitted", label: "Submitted" },
  { value: "needs_revision", label: "Needs revision" },
  { value: "reviewed", label: "Reviewed" },
] as const;

export type DeliverableStatus = (typeof deliverableStatuses)[number]["value"];

export const frictionFrequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

export type FrictionFrequency = (typeof frictionFrequencies)[number]["value"];

export const resourceKinds = [
  { value: "prompt_sheet", label: "Prompt sheet" },
  { value: "slides", label: "Slide deck" },
  { value: "template", label: "Template" },
  { value: "guide", label: "Lab guide" },
] as const;

export type ResourceKind = (typeof resourceKinds)[number]["value"];
