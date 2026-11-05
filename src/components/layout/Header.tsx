"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import type { SiteMeta } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Fixed header with anchor navigation.
 *
 * Anchor links are intercepted rather than left to the browser: a native jump
 * to `#work` sets `window.scrollTo` directly, which Lenis does not know about,
 * so the smoothed position and the real position disagree and the next wheel
 * event snaps the page back. `lenis.scrollTo` moves both in step.
 *
 * `useLenis()` returns undefined when no Lenis instance exists — which is
 * exactly the reduced-motion case, since the provider does not mount one. The
 * fallback is native `scrollIntoView`, so navigation keeps working.
 */
export function Header({ meta, knownAs }: { meta: SiteMeta; knownAs: string }) {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    if (lenis) {
      // Negative offset clears the fixed header so the section heading is not
      // hidden underneath it on arrival.
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    } else {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }

    // Keep the URL meaningful without triggering a browser jump.
    history.replaceState(null, "", href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-rule bg-paper/80 py-3 backdrop-blur-md"
          : "border-b border-transparent py-5",
      )}
    >
      <Container className="flex items-center justify-between gap-6">
        <a
          href="#top"
          onClick={(event) => goTo(event, "#top")}
          className="font-mono text-sm tracking-tight text-ink transition-colors hover:text-blue"
        >
          {knownAs}
          <span className="text-red">.</span>
        </a>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-5 sm:gap-7">
            {meta.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => goTo(event, item.href)}
                  className="font-mono text-xs tracking-wide text-ink-soft transition-colors hover:text-ink sm:text-sm"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
