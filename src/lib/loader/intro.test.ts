import { beforeEach, describe, expect, it } from "vitest";

import { INTRO_SEEN_KEY, hasSeenIntro, markIntroSeen, resolveIntro } from "./intro";

/** A minimal in-memory stand-in for sessionStorage. */
function createStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => void map.delete(key),
    setItem: (key, value) => void map.set(key, value),
  };
}

/** Safari in private mode throws on access. So does a browser with site data blocked. */
function createHostileStorage(): Storage {
  const boom = () => {
    throw new DOMException("denied", "SecurityError");
  };
  return {
    get length(): number {
      return boom();
    },
    clear: boom,
    getItem: boom,
    key: boom,
    removeItem: boom,
    setItem: boom,
  };
}

describe("hasSeenIntro / markIntroSeen", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it("reports false before the intro has played", () => {
    expect(hasSeenIntro(storage)).toBe(false);
  });

  it("reports true after being marked", () => {
    markIntroSeen(storage);
    expect(hasSeenIntro(storage)).toBe(true);
  });

  it("writes under a namespaced key", () => {
    markIntroSeen(storage);
    expect(storage.getItem(INTRO_SEEN_KEY)).not.toBeNull();
  });

  it("treats unavailable storage as 'not seen' rather than throwing", () => {
    // Failing open is the right default: worst case someone sees the intro
    // twice. Throwing here would take the whole page down.
    expect(() => hasSeenIntro(undefined)).not.toThrow();
    expect(hasSeenIntro(undefined)).toBe(false);
  });

  it("swallows storage access errors in both directions", () => {
    const hostile = createHostileStorage();

    expect(() => markIntroSeen(hostile)).not.toThrow();
    expect(hasSeenIntro(hostile)).toBe(false);
  });
});

describe("resolveIntro", () => {
  it("plays for a first-time visitor who is fine with motion", () => {
    expect(resolveIntro({ reducedMotion: false, seen: false })).toBe("play");
  });

  it("skips when the visitor has asked for reduced motion", () => {
    // A static wordmark held for two seconds is not a reduced-motion
    // experience, it is a delay. Skip outright.
    expect(resolveIntro({ reducedMotion: true, seen: false })).toBe("skip");
  });

  it("skips when the intro already played this session", () => {
    expect(resolveIntro({ reducedMotion: false, seen: true })).toBe("skip");
  });

  it("skips when both apply", () => {
    expect(resolveIntro({ reducedMotion: true, seen: true })).toBe("skip");
  });
});
