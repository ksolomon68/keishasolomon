import { InstructorGuide } from "@/components/admin/instructor-guide";
import { cohortSchedule } from "@/lib/cohort-schedule";

// TEMPORARY visual-check route (no auth). Delete before finishing.
export default function GuidePreview() {
  return (
    <div className="mx-auto max-w-[8.5in] px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <InstructorGuide cohort={null} schedule={cohortSchedule({})} participantCount={0} capstoneComplete={0} />
    </div>
  );
}
