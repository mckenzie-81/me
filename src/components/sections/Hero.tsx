import { ArrowDown } from "lucide-react";

import { Reveal } from "@/components/anim/Reveal";
import { SplitLines } from "@/components/anim/SplitLines";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/content/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-32 pb-24"
    >
      <Container className="flex flex-col gap-10">
        <Reveal className="flex items-center gap-3">
          {profile.available && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-red" />
            </span>
          )}
          <span className="font-mono text-xs tracking-[0.18em] text-ink-soft uppercase">
            {profile.availabilityNote} · {profile.location}
          </span>
        </Reveal>

        <div className="flex flex-col gap-6">
          {/* The h1 carries the name for SEO and screen readers; the split
              happens on the text nodes inside it, so the heading semantics are
              untouched by the animation. */}
          <SplitLines
            as="h1"
            className="text-5xl leading-[0.95] font-medium tracking-tight text-balance sm:text-7xl md:text-8xl"
          >
            {profile.name}
          </SplitLines>

          <SplitLines
            as="p"
            delay={0.25}
            className="max-w-2xl text-xl leading-snug text-ink-soft sm:text-2xl md:text-3xl"
          >
            {profile.role} — {profile.blurb}
          </SplitLines>
        </div>

        <Reveal delay={0.6} className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm transition-colors hover:border-blue hover:text-blue"
          >
            Get in touch
          </a>
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-xs text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-blue"
            >
              {social.label}
            </a>
          ))}
        </Reveal>
      </Container>

      <Reveal
        delay={1}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown
          aria-hidden
          className="size-4 animate-bounce text-ink-faint"
          strokeWidth={1.5}
        />
      </Reveal>
    </section>
  );
}
