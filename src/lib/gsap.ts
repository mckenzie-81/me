"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place to register GSAP plugins and set global defaults.
 *
 * Registering in each component works but means every component has to
 * remember to do it, and double-registration warnings start showing up in dev.
 * Importing `gsap` from here instead of from "gsap" guarantees the plugins are
 * attached before any tween is created.
 *
 * `useGSAP` is registered as a plugin so GSAP knows it is running inside React
 * and can tie animation cleanup to component lifecycle. That is what prevents
 * duplicated tweens and leaked ScrollTriggers under React Strict Mode, which
 * mounts every component twice in development.
 */

/**
 * No guard needed around this: an ES module is evaluated exactly once per
 * process no matter how many components import it, and `registerPlugin` is
 * idempotent anyway.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);

gsap.defaults({
  ease: "power3.out",
  duration: 0.9,
});

/**
 * GSAP throttles its ticker when the tab is backgrounded, then tries to catch
 * up on return. With scroll-driven animation that catch-up is visible as a
 * jump. Disabling lag smoothing trades that for honest frame times.
 */
gsap.ticker.lagSmoothing(0);

/**
 * iOS Safari fires a resize event when the URL bar collapses during scroll.
 * Left alone, ScrollTrigger recalculates every trigger mid-scroll, which reads
 * as a stutter on exactly the devices least able to absorb it.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
