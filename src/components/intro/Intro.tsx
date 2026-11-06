"use client";

import { useLenis } from "lenis/react";
import { useReducer, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/loader/gate";
import { getIntroStorage, markIntroSeen } from "@/lib/loader/intro";
import {
  initialLoaderState,
  isIntroVisible,
  loaderReducer,
} from "@/lib/loader/machine";

import { Wordmark } from "./Wordmark";
import { WORDMARK_WIPE } from "./wordmark-data";

/**
 * The intro: the signature writes itself, then the screen lifts away in
 * stacked colour panels.
 *
 * Deliberately thin. Every decision with a real failure mode — whether to play
 * at all, which phase follows which, what happens when callbacks arrive out of
 * order — lives in `@/lib/loader/*` and is unit tested. What is left here is
 * the part only an eye can judge: durations, easings, stacking order.
 *
 * Whether to play is decided by the blocking script in the document head and
 * read here from `data-intro`. Deciding in an effect would cost one visible
 * frame of curtain for someone who should never have seen it.
 */

/** Longest the intro may hold the page, whatever goes wrong. */
const SAFETY_TIMEOUT_MS = 6000;

/**
 * Curtain panels, back to front — which is also DOM order, so the stacking
 * needs no z-index. The last entry is the front panel and carries the
 * signature.
 *
 * Every panel must contrast with the one behind it, or its lift is invisible.
 * That rules out ending on paper, since the page itself is paper: the final
 * reveal would be paper sliding off paper. So the stack runs dark to light and
 * hands over to the page — ink, then accent, then paper:
 *
 *   inverse surface (signature)  ->  accent  ->  the page
 *
 * Using the `-inverse` tokens rather than literal colours means this holds in
 * both themes without a branch: in light you arrive on dark and light floods
 * in; in dark it is the other way round. The loader is never the same surface
 * as the home it opens onto.
 *
 * Two panels, not three. A third only pays for itself if it contrasts with
 * both neighbours, and this palette has no fourth value that does.
 */
const CURTAINS = ["bg-accent", "bg-ground-inverse"] as const;

export function Intro({ word }: { word: string }) {
  const [state, dispatch] = useReducer(loaderReducer, initialLoaderState);
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      /** Hand the page back. Safe to call more than once. */
      const release = () => {
        markIntroSeen(getIntroStorage());
        markIntroDone(document);
        document.documentElement.removeAttribute("data-loading");
        lenis?.start();
      };

      if (document.documentElement.dataset.intro !== "play") {
        // Reduced motion, a repeat visit this session, or the head script
        // failed. CSS already hid the overlay; just tidy up.
        dispatch({ type: "SKIP" });
        release();
        return;
      }

      dispatch({ type: "START" });

      // Browsers restore scroll position on reload. Without this the curtain
      // lifts on whatever section the visitor was last reading.
      lenis?.stop();
      window.scrollTo(0, 0);

      const wipe = root.querySelector("[data-wipe]");
      const mark = root.querySelector("[data-wordmark]");
      // DOM order is back-to-front; reverse so the stagger lifts the top sheet
      // first and each panel below is revealed in turn.
      const panels = gsap.utils
        .toArray<HTMLElement>("[data-curtain]", root)
        .reverse();

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          dispatch({ type: "LIFT_COMPLETE" });
          release();
        },
      });

      timeline
        // 1 — write. A clip sweeping along the writing direction, not a
        // stroke-dash: this artwork is a filled monoline script, and dashing
        // its perimeter unrolls the whole word at once instead of writing it.
        .fromTo(
          wipe,
          { attr: { width: 0 } },
          { attr: { width: WORDMARK_WIPE.width }, duration: 1.3 },
        )
        .add(() => dispatch({ type: "DRAW_COMPLETE" }))

        // 2 — settle. A beat to read it before anything moves.
        .to({}, { duration: 0.25 })
        .add(() => dispatch({ type: "SETTLE_COMPLETE" }))

        // 3 — lift.
        .to(panels, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          stagger: 0.12,
        })
        .to(
          mark,
          {
            // Drifts slower than the sheet carrying it, so the lift has depth
            // rather than reading as one flat plane sliding off.
            yPercent: -35,
            duration: 0.9,
            ease: "power4.inOut",
          },
          "<",
        );

      // If a callback never fires — dropped frames, a GSAP error, the tab
      // backgrounded at the wrong moment — the page must not stay covered.
      // This is the one guarantee worth hard-coding.
      const safety = window.setTimeout(() => {
        timeline.kill();
        dispatch({ type: "SKIP" });
        release();
      }, SAFETY_TIMEOUT_MS);

      return () => window.clearTimeout(safety);
    },
    { scope: rootRef, dependencies: [lenis] },
  );

  if (!isIntroVisible(state.phase)) return null;

  return (
    <div
      ref={rootRef}
      data-intro-root
      /**
       * Decorative. The page is already behind this overlay and fully
       * available to assistive tech, so announcing a loading screen would add
       * noise and a focus trap for no benefit.
       */
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      {CURTAINS.map((surface, index) => (
        <div
          key={surface}
          data-curtain
          className={`absolute inset-0 ${surface}`}
        >
          {/* The signature rides the front sheet, so it leaves with it. */}
          {index === CURTAINS.length - 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div data-wordmark className="w-[min(68vw,30rem)]">
                <Wordmark reveal word={word} className="w-full text-ink-inverse" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
