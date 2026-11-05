import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type SectionProps = {
  /** Doubles as the anchor target for the header nav. */
  id: string;
  children: ReactNode;
  className?: string;
};

/**
 * Consistent vertical rhythm and a scroll-margin that accounts for the fixed
 * header — so keyboard and hash navigation land below it, not behind it.
 */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-section", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}
