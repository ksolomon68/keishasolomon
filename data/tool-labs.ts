export interface ToolLab {
  tool: string;
  purpose: string;
  steps: string[];
  evidence: string;
  criteria: string[];
  fallback: string;
}

/** Original internal tools and teaching exercises for the cohort workspace. */
export const toolLabs: Record<string, ToolLab> = {
  s1: {
    tool: "Assistant Selection Planner",
    purpose: "Choose an assistant for one recurring task and explain why it fits your needs.",
    steps: [
      "Describe your task, budget, team size, and permitted data. Complete the Assistant Selection Planner below and download your editable plan.",
      "Treat the recommendation as a starting point. Check the provider's current features, cost, and data policies against your organization's rules; record anything still awaiting approval.",
      "Use an approved assistant on one fictional input. Check the output against the input and record total time including setup, review, and corrections.",
    ],
    evidence: "Attach your tool-choice rationale, fictional input, reviewed output, and timing record to the AI Readiness Audit. Revisit the choice during Session 2's policy exercise.",
    criteria: ["The choice addresses a specific task and constraints.", "Provider checks and approval questions are documented.", "The sample shows a human check and one limitation."],
    fallback: "Compare two assistants using their provider information, or evaluate the assistant you already have permission to use. Record why an alternative was ruled out.",
  },
  s4: {
    tool: "Lead Priority Tracker",
    purpose: "Practice intake, prioritization, and follow-up before designing your own pipeline.",
    steps: [
      "Create five fictional inquiries, including one duplicate and one missing important information. Use the Lead Priority Tracker below to record, prioritize, and track follow-up. Observe how invalid and duplicate entries are handled.",
      "Compare the tool's priorities with your own written rules. Explain one disagreement and decide who reviews uncertain cases. Do not contact anyone during the exercise.",
      "Map intake → validation → prioritization → draft follow-up → human approval. Test the map manually or in a sandbox, including duplicates and missing fields; document a pause and recovery route.",
    ],
    evidence: "Attach the fictional records, priority comparison, workflow map, and test results to the Operational Trigger Pipeline submission. Identify whether it is a simulation, pilot, or approved deployment.",
    criteria: ["Priorities are justified rather than accepted automatically.", "Duplicate and incomplete inquiries have clear handling.", "The workflow identifies an owner, approval point, and recovery route."],
    fallback: "Use a spreadsheet with inquiry, priority reason, owner, next action, and follow-up date. A manual simulation is valid evidence for this tool lab.",
  },
  s5: {
    tool: "Content Draft Studio",
    purpose: "Practice turning one supported idea into drafts for three relevant channels.",
    steps: [
      "Choose one fictional or public source idea. Use Content Draft Studio below to create editable LinkedIn, Instagram, and email templates from your own takeaway and call to action.",
      "Edit the drafts against your Brand Voice Bible. Check every factual claim, remove invented testimonials, adapt each call to action, and describe accessibility needs.",
      "Place the revised drafts into your editorial calendar with an owner and draft status. Time generation, editing, and review; compare with your usual process. Publication requires approval of the exact version.",
    ],
    evidence: "Attach the source idea, original and revised drafts, editing rationale, and timing record to the Brand Knowledge Base & Content Calendar submission.",
    criteria: ["Three drafts suit their channel and audience.", "Claims are supported and voice changes are explained.", "The calendar records ownership and approval status."],
    fallback: "Adapt the drafts manually using the starter template if interactive drafting is unavailable. Submit the same comparison and review evidence.",
  },
};

export function toolLabStarter(sessionId: string): string {
  const lab = toolLabs[sessionId];
  if (!lab) return "";
  return `APPLIED TOOL LAB — ${lab.tool}\nTask / owner / date:\nTool used (or fallback) / approval status:\nFictional or permitted input:\nOriginal result / evidence location:\nHuman checks / corrections / revised result:\nLimitations / next experiment:\n\nOUTCOME RECORD\nComparable task and measurement method:\nBaseline minutes per task / observation date:\nTrial 1 — setup + execution + review + correction minutes:\nTrial 2 — setup + execution + review + correction minutes:\nTrial 3 — setup + execution + review + correction minutes:\nQuality check / errors in each trial:\nAverage total trial minutes:\nNet minutes saved per task = baseline minus average total trial minutes:\nFrequency / estimated weekly impact / assumptions:\nAdopt, revise, or stop — reason:\n\nSUBMISSION\n${lab.evidence}\n\nKeep zero or negative results. Separate one-time setup from recurring effort when explaining future estimates. Save this record in your own document and submit it with the session deliverable; downloading does not save it to your account.`;
}
