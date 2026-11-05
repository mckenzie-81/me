"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /**
   * Fraction of the element's own height to travel across the full scroll pass.
   * Positive lags behind the scroll, negative runs ahead of it. Keep it under
   * ~0.3 — beyond that it reads as broken rather than deep.
   */
  speed?: number;
};

/**
 * Scroll-linked translation. This is the component that justifies the Lenis
 * work in SmoothScroll: `scrub: true` ties the tween's playhead directly to
 * scroll position, so if Lenis and ScrollTrigger are reading different clocks
 * the lag shows up here first, as the element visibly trailing the page.
 *
 * `ease: "none"` is required — any easing on a scrubbed tween means the element
 * moves at a different rate than the scroll that is driving it.
 */
export function Parallax({
  children,
  className,
  as: Tag = "div",
  speed = 0.15,
}: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            // The whole time the element is anywhere in the viewport.
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
