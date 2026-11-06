"use client";

import { useLenis } from "lenis/react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Wordmark } from "@/components/intro/Wordmark";
import { site } from "@/site";

/**
 * The mark is the signature from the loader, not type.
 *
 * The intro writes it, the curtain lifts, and the same artwork takes its place
 * in the corner — which turns the loader into an introduction rather than a
 * flourish that happens once and is never referred to again. It also stops the
 * header repeating the <h1> directly below it, and it is the one thing here
 * that is artwork rather than a font choice.
 *
 * It needs stroking to survive at this size; see `weight` on Wordmark.
 *
 * Two rows on a phone — the logo centred on its own, the links and the theme
 * toggle centred beneath it — and one row from `md`. The switch happens at the
 * same breakpoint as the hero's, so the page never shows a left-ranged header
 * above a centred hero.
 *
 * Anchor links are intercepted rather than left to the browser.
 *
 * A native jump to `#work` calls `window.scrollTo` directly, which Lenis knows
 * nothing about, so the smoothed position and the real position disagree and
 * the next wheel event snaps the page back. `lenis.scrollTo` moves both.
 *
 * `useLenis()` returns undefined when no instance exists — exactly the
 * reduced-motion case, since the provider does not mount one — so the native
 * fallback keeps navigation working.
 */
export function Header() {
  const lenis = useLenis();

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    // Sections are still being built. A link to one that does not exist yet
    // should do nothing, not scroll to the top.
    if (!target) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    } else {
      target.scrollIntoView({ block: "start" });
    }
    history.replaceState(null, "", href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between md:gap-6 md:px-10">
        <a
          href="#top"
          onClick={(event) => goTo(event, "#top")}
          className="text-ink transition-opacity hover:opacity-70"
        >
          <Wordmark word={site.knownAs} weight={1.1} className="h-6 w-auto" />
        </a>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav aria-label="Sections">
            <ul className="flex items-center gap-5 sm:gap-7">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => goTo(event, item.href)}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
