import type { PlanInquiry } from "./store/types";
import { inquiryPlanOptions, teamSizeOptions } from "../data/plans";

export const INQUIRY_NOTIFICATION_EMAIL = "ks@evobrand.net";

export function inquiryNotification(inquiry: PlanInquiry, siteUrl: string) {
  const plan = inquiryPlanOptions.find((option) => option.value === inquiry.plan)?.label ?? inquiry.plan;
  const size = teamSizeOptions.find((option) => option.value === inquiry.teamSize)?.label ?? inquiry.teamSize;
  return {
    to: INQUIRY_NOTIFICATION_EMAIL,
    replyTo: inquiry.email,
    subject: "New team or program inquiry — The AI Executive Sandbox",
    text: [
      "A prospective customer submitted the public inquiry form.",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Organization: ${inquiry.organization}`,
      `Interested in: ${plan}`,
      `Group size: ${size}`,
      "",
      "Their message:",
      inquiry.message || "No additional message supplied.",
      "",
      `Review inquiries (instructor sign-in required): ${siteUrl.replace(/\/$/, "")}/admin/inquiries`,
      `Inquiry reference: ${inquiry.id}`,
      "",
      "Reply to this email to follow up with the prospective customer. Update their inquiry status in the instructor inbox.",
    ].join("\n"),
  };
}
