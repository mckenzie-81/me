"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  type Theme,
  getThemeStorage,
  isTheme,
  nextTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "@/lib/theme";

/**
 * The live theme, plus a way to change it.
 *
 * `<html data-theme>` is the single source of truth rather than React state:
 * the head script sets it before paint, CSS reads it, and the toggle writes
 * it. A MutationObserver turns that attribute into a subscribable store, so
 * React observes the DOM instead of racing it.
 */

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : "light";
}

// The server cannot know. Components must therefore not render different
// markup per theme — see ThemeToggle, which renders both icons and lets CSS
// choose, precisely to avoid a hydration mismatch here.
const getServerSnapshot = (): Theme => "light";

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Follow the OS while the visitor has made no explicit choice. Someone who
   * has chosen keeps their choice; everyone else tracks their system when it
   * flips at sunset. This writes to the DOM rather than to state, so the
   * observer above picks it up through the same path as the toggle.
   */
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme(getThemeStorage()) !== null) return;
      document.documentElement.dataset.theme = resolveTheme(null, query.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = nextTheme(getSnapshot());
    document.documentElement.dataset.theme = next;
    storeTheme(getThemeStorage(), next);
  };

  return { theme, toggle };
}
