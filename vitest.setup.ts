import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * jsdom implements no `matchMedia`, and GSAP's ScrollTrigger calls it the
 * moment it is registered. Any component that imports `@/lib/gsap` therefore
 * throws on import alone, before a single assertion runs.
 *
 * Always "no match": tests assert markup, and the one media query that
 * changes behaviour — prefers-reduced-motion — is honoured through
 * `gsap.matchMedia`, whose tweens are deliberately not under test.
 */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// React Testing Library does not auto-clean when `globals: false`.
afterEach(cleanup);
