import { describe, expect, it } from "vitest";

import {
  THEME_KEY,
  nextTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "./theme";

function createStorage(seed?: Record<string, string>): Storage {
  const map = new Map(Object.entries(seed ?? {}));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  };
}

function hostileStorage(): Storage {
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

describe("resolveTheme", () => {
  it("follows the system when nothing has been chosen", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("lets an explicit choice override the system", () => {
    // Someone on a dark OS who picked light meant it.
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("ignores a stored value that is not a theme", () => {
    // Hand-edited storage, a stale key from an older version of the site, or
    // another app on the same origin. Fall back to the system rather than
    // rendering with an undefined theme.
    expect(resolveTheme("midnight", true)).toBe("dark");
    expect(resolveTheme("", false)).toBe("light");
  });
});

describe("nextTheme", () => {
  it("flips", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});

describe("readStoredTheme / storeTheme", () => {
  it("round-trips a choice", () => {
    const storage = createStorage();
    storeTheme(storage, "dark");
    expect(readStoredTheme(storage)).toBe("dark");
    expect(storage.getItem(THEME_KEY)).toBe("dark");
  });

  it("returns null when nothing is stored", () => {
    expect(readStoredTheme(createStorage())).toBeNull();
  });

  it("returns null for a stored value that is not a theme", () => {
    expect(readStoredTheme(createStorage({ [THEME_KEY]: "banana" }))).toBeNull();
  });

  it("survives storage being unavailable or throwing", () => {
    // Safari private mode throws on access. Losing the preference is
    // survivable; throwing takes the page down.
    expect(() => readStoredTheme(undefined)).not.toThrow();
    expect(readStoredTheme(undefined)).toBeNull();
    expect(() => storeTheme(hostileStorage(), "dark")).not.toThrow();
    expect(readStoredTheme(hostileStorage())).toBeNull();
  });
});
