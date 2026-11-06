"use client";

import { useRef } from "react";

import { Portrait } from "@/components/Portrait";
import { useIntroDone } from "@/hooks/useIntroDone";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/site";

/**
 * The hero.
 *
 * Left-aligned rather than centred. A centred stack is the default for this
 * kind of page and reads as a profile card; ranging everything from one edge
 * gives the name, the line and the meta row a shared axis, which is what makes
 * it feel set rather than arranged.
 *
 * The portrait takes the open right-hand column, set into its two host
 * shapes. It is the only colour on the page apart from the accent, so it
 * carries the warmth and the type stays monochrome. Its two panels enter as
 * separate steps of the same stagger, so the diptych assembles rather than
 * appearing.
 *
 * On a phone there is no second column, so it sits above the name instead,
 * and the column centres to meet it. The left axis is a two-column argument:
 * with the portrait stacked on top, ranging the type left would leave the
 * figure floating off an edge nothing else uses. One axis either way — it is
 * just a different one.
 *
 * The stacking is grid placement, not `order:` — the portrait is first in the
 * markup and is put back on the right at `md`, which keeps the entrance
 * stagger running top-to-bottom in both layouts. Reordering visually would
 * have left the image animating in last while sitting first.
 *
 * The name is set to hold on two lines rather than to fill the column. A
 * clamp that lets "Richard Bright" wrap gives three ragged lines at some
 * widths, and the break between the given names and the surname is the only
 * one that reads deliberately.
 *
 * Nothing here animates until the intro has lifted. The entrance is a single
 * timeline over `[data-enter]` in DOM order, so the order is the markup order
 * and there are no per-element delays to keep in sync.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      if (!ref.current || !introDone) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-enter]", ref.current);

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          onComplete: () => {
            // Drop the marker so the CSS hidden state stops applying, then
            // clear the inline styles GSAP wrote. Leaves clean DOM.
            items.forEach((item) => item.removeAttribute("data-enter"));
            gsap.set(items, { clearProps: "opacity,transform" });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [introDone] },
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh items-center pt-40 pb-24 md:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <div className="justify-self-center md:col-span-5 md:col-start-8 md:row-start-1 md:justify-self-end">
            <div className="w-[min(36vw,140px)] md:w-[clamp(240px,26vw,340px)]">
              <Portrait />
            </div>
          </div>

          <div className="flex flex-col items-center gap-7 text-center md:col-span-7 md:col-start-1 md:row-start-1 md:items-start md:text-left">
            <span
              data-enter
              className="text-xs tracking-[0.18em] text-muted uppercase"
            >
              {site.location}
            </span>

            <h1
              data-enter
              className="text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-balance"
            >
              {site.name.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              data-enter
              className="max-w-xl text-xl leading-snug text-muted text-balance sm:text-2xl"
            >
              {site.intro}
            </p>

            <div
              data-enter
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-1 md:justify-start"
            >
              {site.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-rule px-3 py-1 text-xs text-muted"
                >
                  {role}
                </span>
              ))}
            </div>

            {/* The thesis of the site, stated once and quietly. The work is the
                point, but so is the reasoning behind it — saying so here is
                what makes the README something a visitor goes looking for. */}
            <p data-enter className="pt-4 text-sm text-muted">
              Built in the open.{" "}
              <a
                href={site.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
              >
                Every decision is written down
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
