/**
 * The three ways to learn with the Sandbox. Prices are deliberately not published here: paid plans are
 * quoted per organization, so the paid tiers lead to an inquiry instead of a checkout.
 */

export type PlanId = "starter" | "teams" | "programs";

export interface Plan {
  id: PlanId;
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  summary: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    audience: "For individuals",
    price: "Free",
    priceNote: "No access code or card needed",
    summary: "Get comfortable with AI on your own. Learn when it helps, when it doesn't, and how to ask for what you need.",
    features: [
      "AI Fit Check: decide whether a task is a good use of AI",
      "Prompt workshop for writing clear, checkable requests",
      "Safe Harbor basics: what never goes into a public AI tool",
      "Personal log of tasks AI could help with",
      "Practice decisions with instant feedback",
    ],
    cta: { label: "Start free", href: "/start" },
  },
  {
    id: "teams",
    name: "Teams",
    audience: "For businesses training their people",
    price: "Custom",
    priceNote: "Quoted by team size",
    summary: "A private cohort for your organization, so your team builds shared habits, a shared policy and real workflows together.",
    features: [
      "Everything in Starter for each team member",
      "Private cohort with its own access code and calendar",
      "All eight guided sessions and seven working assets",
      "Instructor feedback on every submission",
      "Team AI usage policy built from your own rules",
      "Instructor tracking of progress and completed work",
      "One remote 1:1 coaching session per participant",
      "Capstone project and final showcase",
      "Certificate of Completion after completing the program",
    ],
    cta: { label: "Plan training for my team", href: "/plans?plan=teams#inquiry" },
    highlighted: true,
  },
  {
    id: "programs",
    name: "Leadership Programs",
    audience: "For leadership programs and workshops",
    price: "Custom",
    priceNote: "Cohorts, retreats and one-day workshops",
    summary: "The full AI Executive Sandbox adapted for leadership groups: in-person sessions, practical projects and one private coaching session per participant.",
    features: [
      "Everything in Teams",
      "Eight 90-minute in-person sessions, weekly or monthly",
      "One remote 1:1 coaching session per participant, with a private coaching log",
      "Capstone project and final showcase",
      "Certificate of Completion after completing the program",
      "Single-day workshop formats available",
    ],
    cta: { label: "Bring the Sandbox to my program", href: "/plans?plan=programs#inquiry" },
  },
];

/** Rows of the comparison table; each cell is included (true), not included (false) or a short note. */
export const planComparison: { feature: string; starter: boolean | string; teams: boolean | string; programs: boolean | string }[] = [
  { feature: "AI Fit Check and prompt workshop", starter: true, teams: true, programs: true },
  { feature: "Safe Harbor basics", starter: true, teams: true, programs: true },
  { feature: "Personal workplace problem log", starter: true, teams: true, programs: true },
  { feature: "Guided sessions", starter: "Preview", teams: "All 8", programs: "All 8, in person" },
  { feature: "Session tools and saved drafts", starter: false, teams: true, programs: true },
  { feature: "Instructor feedback on your work", starter: false, teams: true, programs: true },
  { feature: "Help requests to your instructor", starter: false, teams: true, programs: true },
  { feature: "Cohort access code and calendar", starter: false, teams: true, programs: true },
  { feature: "Remote 1:1 coaching", starter: false, teams: "1 per participant", programs: "1 per participant" },
  { feature: "Capstone and certificate", starter: false, teams: true, programs: true },
];

export const planFaqs = [
  {
    q: "Who receives a Certificate of Completion?",
    a: "Every participant who completes the full cohort program receives a Certificate of Completion, whether they join through Teams or Leadership Programs. Complete all required capstone milestones in your dashboard to unlock your certificate, then print it or save it as a PDF. Starter is an introduction; join a cohort to complete the full program. Short workshop formats and their completion requirements are agreed with the instructor before enrollment.",
  },
  {
    q: "Is Starter really free?",
    a: "Yes. Create an account with your name, email and a password. There is no trial period and nothing to cancel.",
  },
  {
    q: "I was given an access code. Which plan am I on?",
    a: "Your organization or program has already arranged a Teams or Leadership Programs place for you. Activate your account with the code, or, if you started on Starter, enter the code from your dashboard to join your cohort. Your saved problem log comes with you.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. Every plan is built for people who are new or unsure about AI. No coding is required.",
  },
  {
    q: "How is pricing set for Teams and Leadership Programs?",
    a: "It depends on group size, format and schedule. Send a short inquiry and you'll receive a proposal; nothing is charged through this site.",
  },
] as const;

export const inquiryPlanOptions = [
  { value: "teams", label: "Teams: train my staff" },
  { value: "programs", label: "Leadership program or workshop" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type InquiryPlan = (typeof inquiryPlanOptions)[number]["value"];

export const teamSizeOptions = [
  { value: "1-10", label: "1–10 people" },
  { value: "11-25", label: "11–25 people" },
  { value: "26-50", label: "26–50 people" },
  { value: "51+", label: "51 or more" },
] as const;

export type TeamSize = (typeof teamSizeOptions)[number]["value"];
