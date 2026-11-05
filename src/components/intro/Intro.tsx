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

/**
 * The intro: the wordmark draws itself, then the screen lifts away in two
 * sheets.
 *
 * This component is deliberately thin. Every decision worth getting right —
 * whether to play at all, which phase follows which, what happens when events
 * arrive out of order — lives in `@/lib/loader/*`, which is unit tested.
 * What is left here is the part that can only be judged by looking at it:
 * durations, easings and stacking.
 *
 * Whether to play is NOT decided here either. The blocking script in the
 * document head decides before first paint and records it as `data-intro` on
 * <html>; this component reads that verdict. Deciding in an effect would mean
 * one frame of curtain for someone who should never have seen it.
 */

/** Longest the intro may hold the page, whatever goes wrong. */
const SAFETY_TIMEOUT_MS = 6000;

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
        // failed. The overlay is already hidden by CSS; just tidy up.
        dispatch({ type: "SKIP" });
        release();
        return;
      }

      dispatch({ type: "START" });

      // Browsers restore scroll position on reload. Without this the curtain
      // would lift on whatever section the visitor happened to be reading.
      lenis?.stop();
      window.scrollTo(0, 0);

      const letters = gsap.utils.toArray<SVGPathElement>("[data-letter]", root);
      const front = root.querySelector('[data-curtain="front"]');
      const back = root.querySelector('[data-curtain="back"]');
      const mark = root.querySelector("[data-wordmark]");

      // Prime each outline as a single dash exactly as long as the path, then
      // offset it by its own length — which hides it completely. Animating the
      // offset back to zero walks the dash along the path: the draw.
      // The length has to be measured per letter; a shared value would make
      // "i" finish long before "m" has started.
      letters.forEach((letter) => {
        const length = letter.getTotalLength();
        gsap.set(letter, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          dispatch({ type: "LIFT_COMPLETE" });
          release();
        },
      });

      timeline
        // 1 — draw
        .to(letters, {
          strokeDashoffset: 0,
          duration: 0.9,
          stagger: 0.06,
        })
        .add(() => dispatch({ type: "DRAW_COMPLETE" }))

        // 2 — settle: ink floods the outlines, and the outlines dissolve into
        // it. `fill` is switched instantly rather than tweened because "none"
        // is a keyword, not a colour, and has nothing to interpolate from.
        // Opacity is what actually animates.
        .set(letters, { fill: "currentColor" })
        .to(letters, { fillOpacity: 1, duration: 0.4, stagger: 0.015 })
        .to(letters, { strokeOpacity: 0, duration: 0.3 }, "<")
        .add(() => dispatch({ type: "SETTLE_COMPLETE" }))
        .to({}, { duration: 0.2 })

        // 3 — lift. Two sheets, not one: the paper sheet rises to reveal navy
        // behind it, then navy rises to reveal the page. The 0.12s offset is
        // the whole effect — simultaneous sheets just look like one sheet.
        .to(front, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        })
        .to(
          mark,
          {
            // Drifts slower than the sheet carrying it, so the lift has depth
            // instead of reading as one flat plane sliding off.
            yPercent: -35,
            duration: 1,
            ease: "power4.inOut",
          },
          "<",
        )
        .to(
          back,
          {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
          },
          "<0.12",
        );

      // If any callback above never fires — a dropped frame budget, a GSAP
      // error, a tab backgrounded at the wrong moment — the page must not stay
      // covered. This is the one guarantee worth hard-coding.
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
       * Decorative. The real page is already behind this overlay and fully
       * available to assistive tech, so announcing a loading screen would add
       * noise and a focus trap for no benefit. Sighted users get the intro;
       * everyone else gets the content immediately.
       */
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <div data-curtain="back" className="absolute inset-0 bg-navy" />
      <div
        data-curtain="front"
        className="absolute inset-0 flex items-center justify-center bg-paper"
      >
        <div data-wordmark className="w-[min(62vw,34rem)]">
          <Wordmark word={word} className="w-full text-ink" />
        </div>
      </div>
    </div>
  );
}
