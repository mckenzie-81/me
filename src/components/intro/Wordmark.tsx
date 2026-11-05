"use client";

import { useId } from "react";

import {
  WORDMARK_PATH,
  WORDMARK_VIEWBOX,
  WORDMARK_WIPE,
} from "./wordmark-data";

type WordmarkProps = {
  /** The accessible name. The artwork itself is fixed. */
  word: string;
  className?: string;
  /**
   * Render hidden, ready to be written on. The Intro animates `[data-wipe]`
   * outwards to reveal it.
   *
   * Off by default so the signature can be dropped anywhere else — a header,
   * a footer — and simply render, rather than waiting on an animation that
   * will never come.
   */
  reveal?: boolean;
};

/**
 * The signature.
 *
 * Presentational by design: no refs, no timeline, no GSAP import. It exposes
 * `[data-wipe]` and the Intro animates it from outside. That keeps this
 * testable in jsdom and keeps the artwork reusable away from the loader.
 */
export function Wordmark({ word, className, reveal = false }: WordmarkProps) {
  // SVG ids are document-global, so two wordmarks on one page sharing a
  // clipPath id would mean the second silently drives the first one's clip.
  // useId is stable across server and client render, so it also survives
  // hydration.
  const clipId = `wordmark-wipe-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label={word}
      className={["overflow-visible", className].filter(Boolean).join(" ")}
    >
      {reveal && (
        <defs>
          <clipPath id={clipId}>
            <rect
              data-wipe
              x={WORDMARK_WIPE.x}
              y={WORDMARK_WIPE.y}
              width={0}
              height={WORDMARK_WIPE.height}
              transform={`skewX(${WORDMARK_WIPE.skew})`}
            />
          </clipPath>
        </defs>
      )}
      <path
        d={WORDMARK_PATH}
        fill="currentColor"
        clipPath={reveal ? `url(#${clipId})` : undefined}
      />
    </svg>
  );
}
