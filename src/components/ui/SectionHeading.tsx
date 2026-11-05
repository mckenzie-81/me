import { cn } from "@/lib/utils";
import { Reveal } from "@/components/anim/Reveal";

type SectionHeadingProps = {
  /** Small monospace label, e.g. "01 — Work". */
  eyebrow: string;
  title: string;
  className?: string;
};

/**
 * Shared section header. Keeping it in one place means the scroll-reveal timing
 * for every section opener is defined once.
 */
export function SectionHeading({
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Reveal>
        <span className="font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
