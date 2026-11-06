/**
 * Light and dark, resolved in one place.
 *
 * Kept as pure functions with no DOM access so the rule — explicit choice
 * beats system preference, anything unrecognised falls back to system — is
 * stated once and tested, rather than being re-derived in the head script, the
 * toggle and the hook.
 */

export const THEME_KEY = "mck:theme";

export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * `stored` is deliberately typed as `string | null`, not `Theme | null`:
 * it comes from storage, which is shared with every other script on the
 * origin and can contain anything.
 */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

/**
 * localStorage, not sessionStorage — unlike the intro, a theme choice should
 * outlive the visit. Every access is wrapped: Safari in private mode throws on
 * the property access itself.
 */
export function getThemeStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function readStoredTheme(storage: Storage | undefined): Theme | null {
  try {
    const value = storage?.getItem(THEME_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(storage: Storage | undefined, theme: Theme): void {
  try {
    storage?.setItem(THEME_KEY, theme);
  } catch {
    // Not remembering is survivable.
  }
}
