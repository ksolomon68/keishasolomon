import Image from "next/image";
import { instructor } from "@/data/cohortData";

export function InstructorBlock() {
  return (
    <section aria-labelledby="instructor-title" className="border-y border-line bg-paper-deep py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[auto_1fr] lg:px-8">
        <div className="relative size-32 shrink-0 overflow-hidden border-2 border-navy-900 bg-navy-900 sm:size-40">
          <Image
            src="/keisha.jpg"
            alt={instructor.name}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="max-w-3xl">
          <p className="label text-amber-deep">{instructor.role}</p>
          <h2 id="instructor-title" className="mt-2 font-display text-4xl font-light text-navy-900">
            {instructor.name}
          </h2>
          <p className="mt-1 font-medium text-cyan-deep">{instructor.company}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{instructor.summary}</p>
        </div>
      </div>
    </section>
  );
}
