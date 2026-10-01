export interface LeadInput {
  name: string;
  need: string;
  fit: number;
  urgency: number;
  readiness: number;
  followUp: string;
}

export function scoreLead(lead: LeadInput) {
  const bounded = (value: number) => Math.max(0, Math.min(2, Number.isFinite(value) ? value : 0));
  const score = bounded(lead.fit) * 20 + bounded(lead.urgency) * 15 + bounded(lead.readiness) * 15;
  return { score, priority: score >= 70 ? "High" : score >= 40 ? "Medium" : "Low", reason: `Fit ${bounded(lead.fit) * 20}/40 + urgency ${bounded(lead.urgency) * 15}/30 + readiness ${bounded(lead.readiness) * 15}/30` };
}

export function assistantPlan(task: string, privacy: string, budget: string, team: string) {
  const approach = privacy === "restricted"
    ? "Use an organization-approved workspace with documented data controls. Until approved, test only fictional inputs."
    : task === "research" ? "Choose a research assistant that supplies sources. Open and verify the sources before relying on the answer."
    : task === "data" ? "Choose an assistant with spreadsheet or document analysis. Verify calculations against a small known example."
    : "Choose a general drafting assistant with reusable instructions. Test its ability to follow your voice and format.";
  return `ASSISTANT SELECTION PLAN\nRecommended approach: ${approach}\nBudget: ${budget === "free" ? "Start with an approved free option; check limits before depending on it." : "Compare total subscription cost with the measured value of your pilot."}\nTeam: ${team === "team" ? "Name an account owner and check shared access, permissions, and offboarding." : "Keep instructions and test evidence in an inspectable personal playbook."}\n\nSELECTION CHECKLIST\nCandidate / organizational approval:\nRequired features / current cost:\nData retention / training settings / deletion:\nFictional test input / expected output:\nActual output / human corrections:\nDecision and unresolved questions:\n\nThis is a needs-based recommendation, not certification of any provider's security or suitability.`;
}

export function contentDrafts(idea: string, audience: string, takeaway: string, action: string) {
  return [
    { channel: "LinkedIn", text: `${idea}\n\nFor ${audience}: ${takeaway}\n\n${action}` },
    { channel: "Instagram", text: `${idea}\n\n${takeaway}\n\n${action}\n\nVisual brief: illustrate the main idea. Add descriptive alt text before publishing.` },
    { channel: "Email", text: `Subject: ${idea}\n\nHello,\n\nIf you are ${audience}, here is one idea to consider:\n\n${takeaway}\n\n${action}` },
  ];
}
