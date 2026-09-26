import { ClosingCta } from "@/components/landing/closing-cta";
import { CoachingSupport } from "@/components/landing/coaching";
import { Hero } from "@/components/landing/hero";
import { InstructorBlock } from "@/components/landing/instructor";
import { OnboardingPreview } from "@/components/landing/onboarding-preview";
import { SafeHarborPledge } from "@/components/landing/safe-harbor";
import { SyllabusTimeline } from "@/components/landing/syllabus-timeline";
import { ValueMatrix } from "@/components/landing/value-matrix";
import { ScrollSequence } from "@/components/landing/scroll-sequence";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <ScrollSequence />
      <div className="relative z-10">
        <Hero />
        <ValueMatrix />
        <SyllabusTimeline />
        <CoachingSupport />
        <InstructorBlock />
        <OnboardingPreview />
        <SafeHarborPledge />
        <ClosingCta />
      </div>
    </div>
  );
}
