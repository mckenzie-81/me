/**
 * Whether the intro should play at all, and the memory of it having played.
 */

export const INTRO_SEEN_KEY = "mck:intro-seen";

/**
 * sessionStorage, not localStorage.
 *
 * The intro is the brand moment, so it should play on arrival. But replaying
 * it on every internal navigation or refresh within one visit is an obstacle,
 * not an introduction. Session scope draws that line: once per visit.
 */
export function getIntroStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.sessionStorage;
  } catch {
    return undefined;
  }
}

/**
 * Every access is wrapped: Safari in private mode and any browser with site
 * data blocked throw on `sessionStorage`, including on the property access
 * itself. Failing open means the worst case is seeing the intro twice, rather
 * than an unhandled exception taking down the page.
 */
export function hasSeenIntro(storage: Storage | undefined): boolean {
  try {
    return storage?.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(storage: Storage | undefined): void {
  try {
    storage?.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Nothing to do. Not remembering is survivable; throwing is not.
  }
}

export function resolveIntro(input: {
  reducedMotion: boolean;
  seen: boolean;
}): "play" | "skip" {
  // Reduced motion skips outright rather than playing a static version. A
  // motionless wordmark held for two seconds is not an accessible intro, it is
  // a delay with extra steps.
  return input.reducedMotion || input.seen ? "skip" : "play";
}
