import { valueMatrix } from "@/data/cohortData";
import { SectionHeading } from "./section-heading";

export function ValueMatrix() {
  return (
    <section id="method" aria-labelledby="method-title" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="method-title"
          eyebrow="The method"
          title="Built to be used, not just attended"
          intro="Most AI training ends with notes. This cohort ends every month with something running in your business."
        />

        <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
          {valueMatrix.pillars.map((pillar, i) => (
            <li key={pillar.title} className="bg-paper p-7 sm:p-9">
              <p className="label text-amber-deep">0{i + 1}</p>
              <h3 className="mt-4 font-display text-2xl text-navy-900">{pillar.title}</h3>
              <p className="mt-3 text-muted">{pillar.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="pb-5 text-left font-display text-2xl text-navy-900">
              How the Sandbox compares with a typical AI workshop
            </caption>
            <thead>
              <tr className="border-b-2 border-navy-900 text-sm">
                <th scope="col" className="w-1/4 py-3 pr-4 font-semibold text-navy-900">
                  <span className="sr-only">Aspect</span>
                </th>
                <th scope="col" className="w-[37.5%] px-4 py-3 font-semibold text-muted">
                  Typical AI workshop
                </th>
                <th scope="col" className="w-[37.5%] bg-navy-900 px-4 py-3 font-semibold text-amber">
                  The AI Executive Sandbox
                </th>
              </tr>
            </thead>
            <tbody>
              {valueMatrix.rows.map((row) => (
                <tr key={row.dimension} className="border-b border-line align-top">
                  <th scope="row" className="label py-5 pr-4 text-left font-medium text-ink">
                    {row.dimension}
                  </th>
                  <td className="px-4 py-5 text-muted">{row.passive}</td>
                  <td className="bg-navy-900 px-4 py-5 font-medium text-white">{row.sandbox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
