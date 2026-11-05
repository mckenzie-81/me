"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `useSyncExternalStore` rather than `useState` + `useEffect`.
 *
 * A media query is an external store, which is precisely what this hook is for:
 * React reads the current value during render instead of after it, so there is
 * no initial render with a wrong value and no cascading re-render to correct
 * it. It also forces the SSR value to be stated explicitly rather than
 * implied.
 *
 * Caveat: the server snapshot is `false` and the client may immediately report
 * `true`. Use this to decide *behaviour* (whether to attach an animation),
 * never *markup* — rendering different elements from it would be a hydration
 * mismatch.
 */

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// Servers have no motion preference. Assume motion is fine and let the client
// correct it — the alternative disables animation for everyone on first paint.
const getServerSnapshot = () => false;

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
