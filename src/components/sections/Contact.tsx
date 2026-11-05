import { ArrowUpRight } from "lucide-react";

import { Reveal, RevealGroup } from "@/components/anim/Reveal";
import { SplitLines } from "@/components/anim/SplitLines";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/content/types";

export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section id="contact" className="pb-24">
      <div className="flex flex-col gap-14">
        <SectionHeading eyebrow="04 — Contact" title="Let's build something" />

        <div className="flex flex-col gap-10">
          {/* `onScroll` because this heading sits well below the fold — the
              mount-time variant would have finished animating long before the
              user ever got here. */}
          <SplitLines
            as="p"
            onScroll
            className="max-w-3xl text-2xl leading-snug text-ink-soft text-balance sm:text-3xl"
          >
            {profile.available
              ? "I'm currently open to new work. If you have something in mind, I'd like to hear about it."
              : "I'm not taking on new work right now, but I'm always happy to talk."}
          </SplitLines>

          <Reveal>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-baseline gap-3 text-3xl font-medium tracking-tight break-all transition-colors hover:text-blue sm:text-5xl md:text-6xl"
            >
              {profile.email}
              <ArrowUpRight
                aria-hidden
                className="size-6 shrink-0 text-ink-faint transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue sm:size-8"
                strokeWidth={1.5}
              />
            </a>
          </Reveal>

          <RevealGroup
            as="ul"
            className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-8"
          >
            {profile.socials.map((social) => (
              <li key={social.label} data-reveal>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {social.label}
                </a>
              </li>
            ))}
            {profile.resumeUrl && (
              <li data-reveal>
                <a
                  href={profile.resumeUrl}
                  className="font-mono text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  Résumé
                </a>
              </li>
            )}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
