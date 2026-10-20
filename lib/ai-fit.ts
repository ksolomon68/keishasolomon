/**
 * AI Fit Check: a short, explainable questionnaire that helps someone decide whether a task is a good use
 * of AI. Hard stops (sensitive data, irreversible harm with no way to check, work that is mostly human
 * judgment) override the score so the advice never says "go" for something risky.
 */

export const fitQuestions = [
  {
    id: "frequency",
    question: "How often do you do this task?",
    options: [
      { value: "often", label: "Daily or weekly", points: 2 },
      { value: "sometimes", label: "A few times a month", points: 1 },
      { value: "rarely", label: "Rarely or once", points: 0 },
    ],
  },
  {
    id: "kind",
    question: "Is it mostly drafting, summarizing, sorting, comparing or brainstorming?",
    options: [
      { value: "yes", label: "Yes, mostly words, notes or data", points: 2 },
      { value: "partly", label: "Partly", points: 1 },
      { value: "no", label: "No, it's mostly physical work or live conversation", points: 0 },
    ],
  },
  {
    id: "data",
    question: "What information would you have to share with the AI tool?",
    options: [
      { value: "public", label: "General or public information", points: 2 },
      { value: "internal", label: "Internal, but not sensitive", points: 1 },
      { value: "sensitive", label: "Customer, employee, health, financial or confidential details", points: 0 },
    ],
  },
  {
    id: "risk",
    question: "If the result were wrong, what would happen?",
    options: [
      { value: "low", label: "Easy to fix, little harm", points: 2 },
      { value: "medium", label: "Embarrassing or costly", points: 1 },
      { value: "high", label: "Legal, safety or serious harm to someone", points: 0 },
    ],
  },
  {
    id: "verify",
    question: "Could you check the result yourself before using it?",
    options: [
      { value: "easy", label: "Yes, quickly", points: 2 },
      { value: "effort", label: "Yes, with some effort", points: 1 },
      { value: "no", label: "No, I couldn't tell if it was wrong", points: 0 },
    ],
  },
  {
    id: "judgment",
    question: "How much does it depend on your judgment, empathy or relationships?",
    options: [
      { value: "little", label: "Very little", points: 2 },
      { value: "some", label: "Some", points: 1 },
      { value: "mostly", label: "Mostly, e.g. difficult conversations or final decisions about people", points: 0 },
    ],
  },
] as const;

export type FitQuestionId = (typeof fitQuestions)[number]["id"];
export type FitAnswers = Partial<Record<FitQuestionId, string>>;

export type FitVerdict = "good" | "care" | "human" | "protect" | "avoid";

export interface FitResult {
  verdict: FitVerdict;
  title: string;
  summary: string;
  reasons: string[];
  nextSteps: string[];
}

export const isComplete = (answers: FitAnswers) => fitQuestions.every((q) => answers[q.id]);

const points = (answers: FitAnswers) =>
  fitQuestions.reduce((sum, q) => sum + (q.options.find((o) => o.value === answers[q.id])?.points ?? 0), 0);

export function assessFit(answers: FitAnswers): FitResult {
  const reasons: string[] = [];
  if (answers.frequency === "often") reasons.push("You do it often, so time saved adds up quickly.");
  if (answers.frequency === "rarely") reasons.push("You rarely do it, so setting AI up may take longer than doing the task.");
  if (answers.kind === "yes") reasons.push("Drafting, summarizing and sorting are what AI tools do best.");
  if (answers.kind === "no") reasons.push("AI helps least with physical work and live conversation.");
  if (answers.data === "sensitive") reasons.push("The task needs sensitive details, which must not go into a public AI tool.");
  if (answers.data === "internal") reasons.push("Use an AI tool your organization has approved for internal information.");
  if (answers.risk === "high") reasons.push("A mistake could cause serious harm, so a person must own the result.");
  if (answers.verify === "no") reasons.push("You couldn't spot an error, and AI can sound confident while being wrong.");
  if (answers.verify === "easy") reasons.push("You can check the result quickly, which keeps you in control.");
  if (answers.judgment === "mostly") reasons.push("It relies on your judgment and relationships, which people trust you for.");

  if (answers.risk === "high" && answers.verify === "no") {
    return {
      verdict: "avoid",
      title: "Don't use AI for this task.",
      summary: "The stakes are high and you couldn't catch a mistake. Keep this with a qualified person.",
      reasons,
      nextSteps: [
        "Ask whether a smaller, lower-risk part of the task could use AI, such as formatting your own notes.",
        "Check your organization's AI policy for tasks like this one.",
      ],
    };
  }
  if (answers.data === "sensitive") {
    return {
      verdict: "protect",
      title: "Not with real details. Protect the data first.",
      summary: "AI may help with this kind of task, but not with the sensitive information in it.",
      reasons,
      nextSteps: [
        "Practice with a made-up example that has no real names, numbers or records.",
        "Ask your organization which AI tools, if any, are approved for this information.",
        "Use AI for the structure (a template or checklist), then add real details yourself, outside the AI tool.",
      ],
    };
  }
  if (answers.judgment === "mostly") {
    return {
      verdict: "human",
      title: "Keep this human. Let AI help you prepare.",
      summary: "The heart of this task is your judgment. AI can help you get ready, but you should do the work.",
      reasons,
      nextSteps: [
        "Ask AI to list questions to consider or points you might be missing.",
        "Use it to rehearse: ask it to play the other person and respond to your draft.",
        "Write the final message or decision yourself.",
      ],
    };
  }

  const score = points(answers);
  if (score >= 9) {
    return {
      verdict: "good",
      title: "Good fit. Try AI on this task.",
      summary: "This task is frequent, low-risk and easy to check: the kind of work AI handles well.",
      reasons,
      nextSteps: [
        "Write a clear request in the prompt workshop below: role, task, context, limits and format.",
        "Test it on one example and time how long it takes, including your review.",
        "If it saves time, save the request so you can reuse it.",
      ],
    };
  }
  return {
    verdict: "care",
    title: "Worth trying, with care.",
    summary: "AI could help with part of this task. Treat its output as a first draft that you check.",
    reasons,
    nextSteps: [
      "Use AI for one step only, such as a first draft or a summary, rather than the whole task.",
      "Check every fact, name, number and date before you use the result.",
      "Note what you had to fix. If it's a lot, this task may not be worth it.",
    ],
  };
}
