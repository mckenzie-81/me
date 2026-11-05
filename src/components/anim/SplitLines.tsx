"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { useIntroDone } from "@/hooks/useIntroDone";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type SplitLinesProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** Animate on scroll instead of immediately on mount. Use below the fold. */
  onScroll?: boolean;
};

/**
 * Masked line-by-line text reveal — each line slides up from behind a clipped
 * edge. This is the one animation worth a plugin: faking it by splitting on
 * spaces falls apart the moment the text rewraps at a different viewport width.
 *
 * Three ordering details that matter:
 *
 *   1. Split only after fonts are ready. SplitText measures where lines break;
 *      measure with the fallback font, let the real font load, and the line
 *      wrappers end up cut in the wrong places.
 *
 *   2. The element is `visibility: hidden` from CSS until the split is done
 *      (`[data-split]` in globals.css), because inserting line wrappers
 *      visibly reflows the text.
 *
 *   3. Animations are created *inside* `onSplit` rather than after it. With
 *      `autoSplit: true` GSAP re-splits on resize and on font swap, and a tween
 *      returned from `onSplit` is cleaned up and rebuilt against the new lines.
 *      Creating the tween outside would leave it pointing at discarded nodes.
 */
export function SplitLines({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = 0.09,
  onScroll = false,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const el = ref.current;
      // Wait for the curtain, same as Reveal.
      if (!el || !introDone) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let cancelled = false;
        let revert: (() => void) | undefined;
        // A resize re-split should not replay an intro the user already saw.
        let played = false;

        const run = async () => {
          // Imported on demand: SplitText is only needed by this component, so
          // it stays out of the chunk every other component pays for.
          const { SplitText } = await import("gsap/SplitText");
          gsap.registerPlugin(SplitText);

          await document.fonts?.ready;
          if (cancelled || !el.isConnected) return;

          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "split-line",
            onSplit: (self) => {
              gsap.set(el, { visibility: "visible" });
              if (played) return;

              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.1,
                ease: "power4.out",
                stagger,
                delay,
                onComplete: () => {
                  played = true;
                },
                scrollTrigger: onScroll
                  ? { trigger: el, start: "top 85%", once: true }
                  : undefined,
              });
            },
          });

          revert = () => split.revert();
        };

        void run();

        return () => {
          cancelled = true;
          revert?.();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [introDone] },
  );

  return (
    <Tag ref={ref} data-split className={cn(className)}>
      {children}
    </Tag>
  );
}
