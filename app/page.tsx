import { ClosingCta } from "@/components/landing/closing-cta";
import { CoachingSupport } from "@/components/landing/coaching";
import { Hero } from "@/components/landing/hero";
import { InstructorBlock } from "@/components/landing/instructor";
import { OnboardingPreview } from "@/components/landing/onboarding-preview";
import { SafeHarborPledge } from "@/components/landing/safe-harbor";
import { SyllabusTimeline } from "@/components/landing/syllabus-timeline";
import { ValueMatrix } from "@/components/landing/value-matrix";
import { ScrollSequence } from "@/components/landing/scroll-sequence";
import { HeroRoadmap } from "@/components/landing/hero-roadmap";

export default function HomePage() {
  return (
    <div className="home-experience relative min-h-screen bg-navy-950">
      <ScrollSequence />
      <div className="relative z-10">
        <Hero />
        <section aria-labelledby="experience-roadmap-title" className="home-section">
          <div className="home-shell home-surface-dark">
            <div className="home-roadmap-intro">
              <div>
                <p className="label text-amber">The eight-month experience</p>
                <h2
                  id="experience-roadmap-title"
                  className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.08] tracking-tight text-white text-balance sm:text-5xl"
                >
                  See the work take shape, one focused session at a time.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                Explore the monthly rhythm before you dive into the full syllabus. Every stop connects a practical
                lesson to something you can use in your business.
              </p>
            </div>
            <HeroRoadmap />
          </div>
        </section>
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
