import { instructor, onboardingChecklist, safeHarbor, sessions, site } from "../data/cohortData";

export type ChatAnswer = { topic: string; text: string; href: string; label: string };
type Entry = ChatAnswer & { keywords: string };

const entries: Entry[] = [
  { topic: "overview", keywords: "platform program academy sandbox about offer learn beginner coding experience format duration long", text: `${site.name} is a hands-on leadership program taught by ${instructor.name} of ${instructor.company}. It includes eight 90-minute sessions, offered weekly or monthly, remote 1:1 coaching, and seven working assets. No coding is required.`, href: "/", label: "Explore the program" },
  { topic: "register", keywords: "register registration enroll enrol join signup sign up invitation invite access code account", text: "Register with the access code supplied by your instructor or organizer. That code places you in your cohort. If you do not have a code or it is rejected, contact the person who invited you; the assistant cannot issue or reveal access codes.", href: "/register", label: "Register for your cohort" },
  { topic: "login", keywords: "login log sign in password forgot reset locked signin", text: "Use the sign-in page with the email and password you registered with. If you cannot access your account, contact your instructor or reply to your welcome message. Never share your password in chat.", href: "/login", label: "Sign in" },
  { topic: "schedule", keywords: "schedule calendar dates date time timezone venue location where when weekly monthly meeting session start", text: "Your cohort's saved session dates and materials are in Dashboard → Schedule. The public program calendar is a default; your cohort may differ. Start time, time zone, and venue are awaiting confirmation on this site. Check your welcome message or ask your instructor for confirmed logistics.", href: "/dashboard#sessions", label: "View your schedule" },
  { topic: "onboarding", keywords: "onboarding prepare preparation bring laptop equipment required requirements prerequisites chatgpt claude paid subscription google", text: onboardingChecklist.map((item) => `${item.title}: ${item.detail}`).join("\n\n"), href: "/onboarding", label: "Open the preparation checklist" },
  { topic: "deliverables", keywords: "deliverable assignment homework submit submission upload evidence file feedback review revision work save", text: "Go to Dashboard → My work. Open your assignment, follow its guide, use its tool, and save your work. Add your evidence and notes, then submit for instructor review. Instructor feedback appears with your work. If you change reviewed evidence or notes, resubmit for review; for edits at the same external document link, describe the changes in your notes.", href: "/dashboard#deliverables", label: "Open My work" },
  { topic: "tools", keywords: "tools tool lab drafts prompt workshop template workflow automation internal", text: "Dashboard → Tools opens cohort tools inside their assignments. Your saved draft stays in the same workspace as you move between the guide, tool, and submission. The Help section also includes the reusable prompt workshop and guided practice.", href: "/dashboard#tools", label: "Explore cohort tools" },
  { topic: "coaching", keywords: "coach coaching remote book booking appointment one on one 1:1 meet video", text: "Remote 1:1 coaching helps you review a draft, work through a decision, or unblock your capstone. Open Dashboard → Help to find coaching options. Use the booking link if one is available, or contact your instructor. The Meet link appears after confirmation. Bring the work and a clear outcome for the conversation.", href: "/dashboard#support", label: "Find coaching and help" },
  { topic: "support", keywords: "help support contact instructor human person stuck problem error broken email message", text: `Signed-in participants can use Dashboard → Help to create a support request and read instructor replies. Explain where you are stuck and mark it urgent if you are blocked. For account access, reply to your welcome message or contact your organizer.${site.contactEmail ? ` You can also email ${site.contactEmail}.` : ""}`, href: "/dashboard#support", label: "Ask your instructor" },
  { topic: "privacy", keywords: "privacy confidential confidentiality safe harbor sensitive security data private customer", text: `${safeHarbor.intro} Use fictional or anonymized examples in exercises. Do not enter passwords, access codes, or confidential business information in this chat. This assistant answers general platform questions and cannot read participant records.`, href: "/onboarding", label: "Read the Safe Harbor pledge" },
  { topic: "capstone", keywords: "capstone project showcase milestone progress final", text: "Use Dashboard → Progress to track capstone milestones. Your capstone brings the work from the program together for the final showcase. Use coaching or instructor support when you need help moving it forward.", href: "/dashboard#progress", label: "View capstone progress" },
  { topic: "certificate", keywords: "certificate certification completion graduate download", text: "Find the certificate area in your dashboard and open the certificate page. The certificate uses your cohort's name and saved completion date. Ask your instructor about completion eligibility or corrections; this assistant cannot verify your personal progress.", href: "/certificate", label: "Open certificate page" },
  { topic: "pricing", keywords: "price pricing cost fee payment refund discount tuition pay", text: "Pricing, payment terms, and refund details are not published in this assistant's platform guidance. Contact your instructor or organizer for confirmed terms before registering.", href: "/", label: "View the program" },
  ...sessions.map((session): Entry => ({ topic: session.id, keywords: `session ${session.number} ${session.theme} ${session.concepts.join(" ")} ${session.lab.name}`, text: `Session ${session.number}: ${session.theme}\n\n${session.lab.name}: ${session.lab.description}${session.deliverable ? `\n\nYour deliverable: ${session.deliverable.title}. ${session.deliverable.description}` : "\n\nThis is the final showcase session."}`, href: "/dashboard#sessions", label: "View session materials" })),
];

const stop = new Set("a an the is are i my me we you your how what can do does to for of on in it this that please tell about and with have where".split(" "));
const words = (value: string) => value.toLowerCase().replace(/[^a-z0-9:]+/g, " ").split(/\s+/).filter((word) => word && !stop.has(word));

export function answerPlatformQuestion(question: string, previousTopic?: string): ChatAnswer {
  const tokens = [...new Set(words(question))];
  if (/^(hi|hello|hey|thanks|thank you)[!.\s]*$/i.test(question.trim())) return { topic: "greeting", text: "Hello! Ask me about registration, preparation, assignments, tools, coaching, or your cohort schedule.", href: "/", label: "Explore the program" };
  const numbered = question.match(/(?:session|lesson|module)\s*(\d+)/i);
  if (numbered) {
    const session = sessions.find((item) => item.number === Number(numbered[1]));
    if (session) return entries.find((entry) => entry.topic === session.id)!;
  }
  const ranked = entries.map((entry) => {
    const keywords = words(entry.keywords);
    const matches = tokens.filter((token) => keywords.includes(token));
    return { entry, score: matches.length + (matches.length && entry.topic === previousTopic ? 0.25 : 0) };
  }).sort((a, b) => b.score - a.score);
  if (ranked[0].score > 0) return ranked[0].entry;
  if (previousTopic && /^(how|where|what)\b.*\b(it|that|this)\b/i.test(question.trim())) {
    const previous = entries.find((entry) => entry.topic === previousTopic);
    if (previous) return previous;
  }
  return { topic: "unknown", text: "I don't have a confirmed answer to that in the platform guidance. Try asking about registration, assignments, tools, coaching, or the schedule. For a personal account issue or a question that needs confirmation, ask your instructor through Dashboard → Help or reply to your welcome message.", href: "/dashboard#support", label: "Contact instructor support" };
}
