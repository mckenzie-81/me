"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scrolling, wired to GSAP properly.
 *
 * Lenis and ScrollTrigger both want to own the scroll loop, and left alone they
 * desynchronise: Lenis animates the scroll position on its own
 * requestAnimationFrame while ScrollTrigger samples the position on GSAP's
 * ticker. The two run at different points in the frame, so scroll-linked
 * animations lag a frame or two behind the visible scroll — the classic
 * "pinned section jitters" symptom.
 *
 * Two lines fix it:
 *
 *   1. `autoRaf: false` plus `gsap.ticker.add(...)` — Lenis no longer runs its
 *      own loop. GSAP drives it, so there is a single clock for the page.
 *      (Lenis takes milliseconds, the ticker reports seconds; hence `* 1000`.)
 *
 *   2. `lenis.on("scroll", ScrollTrigger.update)` — ScrollTrigger recalculates
 *      on the smoothed position rather than the raw native scroll event.
 *
 * No `scrollerProxy` is needed: in `root` mode Lenis drives the real document
 * scroll, so ScrollTrigger's default scroller is already the right one.
 * (`scrollerProxy` is only required when Lenis is transforming a wrapper
 * element instead.)
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const drive = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(drive);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(drive);
    };
  }, [reducedMotion]);

  /**
   * ScrollTrigger caches each trigger's start/end scroll positions on creation.
   * Late layout shifts — webfonts swapping, images arriving without reserved
   * space — invalidate that cache silently, and animations then fire at the
   * wrong scroll position. Refreshing once everything has loaded is cheap
   * insurance.
   */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    void document.fonts?.ready.then(refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  // Honour the preference by not smoothing the scroll at all. `root` mode adds
  // no DOM of its own, so this branch renders identical markup either way.
  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        // ~1.1s to settle: enough to feel smoothed, short enough that the page
        // still responds to intent rather than gliding past the target.
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Deliberately off. Native touch scrolling is already smooth and
        // hijacking it on mobile is where smooth-scroll libraries earn their
        // bad reputation.
        syncTouch: false,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
