import { Reveal } from "@/components/anim/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile, StackGroup } from "@/content/types";

export function About({
  profile,
  stack,
}: {
  profile: Profile;
  stack: StackGroup[];
}) {
  return (
    <Section id="about">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeading eyebrow="02 — About" title="How I work" />
        </div>

        <div className="flex flex-col gap-12 md:col-span-7 md:col-start-6">
          <div className="flex flex-col gap-5">
            {profile.about.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <p className="text-lg leading-relaxed text-ink-soft">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {/* The stack lives inside About rather than as its own section — a
              standalone skills grid reads as filler, while in context it
              supports the narrative above it. */}
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {stack.map((group, index) => (
              <Reveal key={group.id} delay={index * 0.05} className="flex flex-col gap-2.5">
                <dt className="font-mono text-xs tracking-[0.16em] text-ink-faint uppercase">
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-ink">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-rule px-2 py-1 text-xs text-ink-soft"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
