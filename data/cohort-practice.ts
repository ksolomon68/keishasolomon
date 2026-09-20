/** Adapted from the user-supplied Notebook summary; examples are fictional teaching cases. */
export interface DecisionPractice {
  title: string;
  situation: string;
  choices: { label: string; feedback: string; recommended: boolean }[];
  takeaway: string;
}

export const decisionPractice: Record<string, DecisionPractice> = {
  s1: {
    title: "Ask for evidence, not agreement",
    situation: "Your assistant praises a plan to save five hours a week, but you have not timed the task. What is the most useful next instruction?",
    choices: [
      { label: "Make the proposal sound more confident.", feedback: "Confidence in the wording does not establish that the plan will work. Keep the savings claim provisional until it is tested.", recommended: false },
      { label: "Name the weakest assumption and design a small baseline test.", feedback: "This turns agreement into useful scrutiny. Time the existing task, define an acceptable result, and compare it with the assisted version including review time.", recommended: true },
      { label: "Ask whether the assistant is at least 95% confident.", feedback: "A model's confidence statement is not a measurement. Ask what evidence is missing and how you could check it.", recommended: false },
    ],
    takeaway: "Save a challenge prompt: ‘What am I assuming? What evidence would change this recommendation? What is the smallest test?’",
  },
  s2: {
    title: "Separate instructions from permission",
    situation: "A reusable content playbook is ready. A connector now offers the assistant access to your organization's social accounts. What must happen before it can act?",
    choices: [
      { label: "The playbook is enough; let it publish.", feedback: "A playbook describes a task. It does not grant approval to use accounts or publish on the organization's behalf.", recommended: false },
      { label: "Give it every available permission to avoid interruptions.", feedback: "Access should match the approved task. Unneeded permissions increase the consequences of a mistake.", recommended: false },
      { label: "Confirm the account owner, minimum access, allowed actions, and approval boundary.", feedback: "Now the team knows which account may be used, what the assistant may do, and who must approve a consequential action. Begin in a test or draft-only workflow.", recommended: true },
    ],
    takeaway: "Document instructions, tool access, and human approval separately. A connector enables an action; it does not make the action appropriate.",
  },
  s3: {
    title: "Improve the playbook after a failed test",
    situation: "Your meeting-summary prompt keeps inventing owners when notes omit them. You need to reuse it next week. What should you change?",
    choices: [
      { label: "Add a missing-owner rule, an example, and a repeatable test.", feedback: "Store ‘mark missing owners as unassigned’ in the playbook, add a synthetic example, and retest it. Confirm that the tool has loaded the current instructions before relying on them.", recommended: true },
      { label: "Tell the assistant to remember everything forever.", feedback: "Context and memory behavior depend on the tool and setup. Keep an explicit, versioned playbook you can inspect and reuse.", recommended: false },
      { label: "Fix the names manually each time and call the workflow complete.", feedback: "Manual correction may be necessary, but repeated errors are a signal to improve the instructions. Include correction time when comparing effort.", recommended: false },
    ],
    takeaway: "A useful playbook includes the task, inputs, examples, rules, checks, owner, and last-tested date.",
  },
  s4: {
    title: "Know whether an action actually happened",
    situation: "Your test automation says three posts were scheduled, but only two appear in the destination calendar. What happens next?",
    choices: [
      { label: "Mark all three successful because the assistant said so.", feedback: "The assistant's summary is not proof of delivery. Check the destination and record the actual state of each item.", recommended: false },
      { label: "Rerun all three immediately.", feedback: "That could duplicate the two successful items. Identify the missing item and its state before a targeted retry.", recommended: false },
      { label: "Pause, reconcile each item with its destination record, and retry only when safe.", feedback: "Record the account, scheduled time and time zone, status, and confirmation identifier. Retry only the missing item after checking that it was not already accepted.", recommended: true },
    ],
    takeaway: "Log what the destination confirms. Include a pause switch, duplicate prevention, and a human owner in every workflow hand-off.",
  },
  s5: {
    title: "Review the claim before scheduling",
    situation: "A draft sounds exactly like your brand, but includes a customer testimonial and a 40% savings figure that nobody supplied. What should the editor do?",
    choices: [
      { label: "Publish it; matching the brand voice is the quality check.", feedback: "Style and factual accuracy are different checks. A convincing voice can make an unsupported claim more misleading.", recommended: false },
      { label: "Remove or verify the unsupported claims, approve the final draft, then schedule.", feedback: "Review source support, permissions, tone, accessibility, and the intended action before approving an exact version. Afterwards, verify the correct account and schedule in the destination tool.", recommended: true },
      { label: "Keep the claims and add a generic AI disclaimer.", feedback: "A disclaimer does not establish the truth of a claim or permission to use a testimonial. Resolve the specific issue before publication.", recommended: false },
    ],
    takeaway: "Use this order: voice brief → drafts → supporting visuals → checks and human approval → scheduling → destination verification.",
  },
  s6: {
    title: "Test the smallest useful prototype",
    situation: "Your intake prototype looks polished, but a colleague cannot find the submission button. You have an hour left in the lab. What is the best use of it?",
    choices: [
      { label: "Clarify the primary action and repeat the same task test.", feedback: "A small, observed improvement is better evidence than another feature. Ask the tester to complete the task without explanation, then check keyboard and mobile use.", recommended: true },
      { label: "Add an AI chatbot to explain the interface.", feedback: "That adds scope before the original task works. Fix the confusing step and retest it first.", recommended: false },
      { label: "Launch now because a working page is a finished product.", feedback: "A prototype demonstrates an idea. Real use also needs appropriate handling of data, failures, support, and deployment approval.", recommended: false },
    ],
    takeaway: "Plan the user task, build one path, observe someone using it, and revise. Tool output is the beginning of validation.",
  },
  s7: {
    title: "Make an honest adoption decision",
    situation: "Three trials are faster before review, but corrections erase the time saving. The prototype is attractive. What belongs in the stakeholder package?",
    choices: [
      { label: "Only show the fastest trial.", feedback: "That hides variability and can mislead the adoption decision. Include comparable trials and the full work required.", recommended: false },
      { label: "Assume the team will get faster and claim the expected saving.", feedback: "A hypothesis about future improvement is not an observed result. Label it as a hypothesis and define a test.", recommended: false },
      { label: "Report the full result and propose a specific improvement or a decision not to scale.", feedback: "Include review effort, errors, limitations, and a next test. Stopping an ineffective workflow can be a valuable outcome of the cohort.", recommended: true },
    ],
    takeaway: "A capstone should help someone decide whether to adopt, revise, or stop a workflow—not merely demonstrate that it runs.",
  },
};

export interface PromptBrief {
  role: string;
  task: string;
  context: string;
  constraints: string;
  output: string;
  challenge: boolean;
}

export const exampleBrief: PromptBrief = {
  role: "Operations assistant preparing a meeting action list",
  task: "Turn the fictional notes into actions for a human reviewer. Do not send messages or create tasks in other tools.",
  context: "Fictional notes: Jordan will draft the event agenda by Thursday. A room booking is needed; no owner or deadline was agreed. The previous summary mistakenly invented deadlines.",
  constraints: "Use only the supplied notes. Mark missing owners or dates as not specified. Do not add personal data. A person must check each row before use.",
  output: "A table with action, owner, deadline, supporting note, and questions for the reviewer.",
  challenge: true,
};

export function buildPracticePrompt(brief: PromptBrief): string {
  return [
    `ROLE\n${brief.role.trim()}`,
    `TASK\n${brief.task.trim()}`,
    `CONTEXT AND INPUT\n${brief.context.trim()}`,
    `CONSTRAINTS\n${brief.constraints.trim()}`,
    `OUTPUT\n${brief.output.trim()}`,
    "CLARIFY BEFORE PROCEEDING\nIf a missing detail would materially change the result, ask the most important question first. Otherwise state your assumptions. Do not invent missing facts or treat a confidence percentage as evidence.",
    brief.challenge ? "CHALLENGE THE PLAN\nIdentify the weakest assumption, the evidence that would change your recommendation, and a small test a person can run. Separate observations from guesses." : "REVIEW\nList what a person should verify before using the result.",
  ].join("\n\n");
}
