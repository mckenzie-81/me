"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { useIntroDone } from "@/hooks/useIntroDone";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds to wait after the trigger fires. Use to order nearby elements. */
  delay?: number;
  /** Travel distance in rem. Small is better; this should be felt, not watched. */
  distance?: number;
  /** ScrollTrigger `start`. Default fires when the top hits 88% of viewport. */
  start?: string;
  duration?: number;
};

/**
 * The workhorse scroll reveal: fade and rise once, when scrolled into view.
 *
 * The hidden starting state lives in CSS (`[data-reveal]` in globals.css), not
 * here, so it applies before JavaScript has run and there is no flash of
 * already-visible content. See the long comment in globals.css for why that is
 * gated behind an attribute rather than applied unconditionally.
 *
 * `useGSAP` scopes every selector and tween to this component and reverts them
 * on unmount, which is what keeps React Strict Mode's double mount from
 * leaving a second ScrollTrigger behind.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  distance = 1.75,
  start = "top 88%",
  duration = 0.9,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const el = ref.current;
      // Hold until the curtain is up. Anything in the first viewport would
      // otherwise animate while it is still covered.
      if (!el || !introDone) return;

      // gsap.matchMedia is the idiomatic way to make an animation conditional
      // on a media query: the tween is only created when the query matches,
      // and reverted automatically when it stops matching.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          delay,
          duration,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => {
            // Drop the marker so the CSS hidden state no longer applies, then
            // strip the inline styles GSAP wrote. Leaves clean DOM and, more
            // importantly, releases `will-change` — leaving that on dozens of
            // elements permanently costs real GPU memory.
            el.removeAttribute("data-reveal");
            gsap.set(el, { clearProps: "opacity,transform,willChange" });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [introDone] },
  );

  return (
    <Tag
      ref={ref}
      data-reveal
      className={cn(className)}
      style={{ "--reveal-y": `${distance}rem` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds between each child. */
  stagger?: number;
  delay?: number;
  start?: string;
};

/**
 * Staggers a list in from a single ScrollTrigger.
 *
 * Mark each item with `data-reveal` (the CSS hides them for free) and they
 * animate in sequence. One trigger for the whole group rather than one per item
 * — with long lists that difference is measurable, since every ScrollTrigger
 * costs a position calculation on each refresh.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  stagger = 0.08,
  delay = 0,
  start = "top 85%",
}: RevealGroupProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !introDone) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", el);
      if (!items.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => {
            items.forEach((item) => item.removeAttribute("data-reveal"));
            gsap.set(items, { clearProps: "opacity,transform,willChange" });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [introDone] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
