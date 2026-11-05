import { Reveal } from "@/components/anim/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ExperienceItem } from "@/content/types";

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <Section id="experience">
      <div className="flex flex-col gap-16">
        <SectionHeading eyebrow="03 — Experience" title="Where I've worked" />

        <ol className="flex flex-col gap-px">
          {items.map((item) => (
            <Reveal
              key={item.id}
              as="li"
              className="border-t border-rule py-10 last:border-b"
            >
              <div className="grid gap-5 md:grid-cols-12 md:gap-8">
                <div className="flex flex-col gap-1 font-mono text-xs text-ink-faint md:col-span-3">
                  <span className="tabular-nums">
                    {item.start} — {item.end ?? "Present"}
                  </span>
                  <span>{item.location}</span>
                </div>

                <div className="flex flex-col gap-4 md:col-span-9">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                      {item.role}
                    </h3>
                    <p className="text-sm text-blue">{item.company}</p>
                  </div>

                  <p className="leading-relaxed text-ink-soft">{item.summary}</p>

                  {/* No nested Reveal here: the whole <li> is already one
                      reveal, and a second trigger per bullet would add work
                      for a difference nobody can see. */}
                  <ul className="flex flex-col gap-2">
                    {item.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-relaxed text-ink-soft"
                      >
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-red" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
