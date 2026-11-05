import { cn } from "@/lib/utils";

import {
  WORDMARK_LETTERS,
  WORDMARK_VIEWBOX,
} from "./wordmark-data";

type WordmarkProps = {
  /** The accessible name. The rendered shapes are fixed, generated outlines. */
  word: string;
  className?: string;
};

/**
 * The wordmark, as outlines.
 *
 * Deliberately presentational and free of animation: it takes no refs,
 * triggers nothing, and has no "use client". The Intro component animates it
 * from the outside by querying `[data-letter]`. That separation is what makes
 * it testable in jsdom, where `getTotalLength()` — which the draw depends on —
 * does not exist.
 *
 * `overflow-visible` matters: strokes are centred on the path, so half the
 * stroke width sits outside the glyph bounds and would otherwise be clipped by
 * the viewBox.
 */
export function Wordmark({ word, className }: WordmarkProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label={word}
      className={cn("overflow-visible", className)}
    >
      {WORDMARK_LETTERS.map((letter, index) => (
        <path
          key={`${letter.char}-${index}`}
          data-letter
          d={letter.d}
          fill="none"
          // Primed for the ink flood: the Intro switches `fill` to a real
          // colour and animates this to 1. Starting at 0 means the switch
          // itself is invisible.
          fillOpacity={0}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
