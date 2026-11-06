"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * Both icons are always rendered and CSS hides one, keyed off
 * `<html data-theme>` (see globals.css).
 *
 * Rendering only the current icon would be a hydration mismatch: the server
 * has no way to know the theme, so it would always emit the light-mode icon
 * and React would find the dark one on the client. The same reasoning is why
 * the label is static rather than naming the target theme.
 */
export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className="-m-2 cursor-pointer p-2 text-muted transition-colors hover:text-ink"
    >
      <svg
        data-icon="sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="size-[18px]"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
      </svg>
      <svg
        data-icon="moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        aria-hidden
      >
        <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
      </svg>
    </button>
  );
}
