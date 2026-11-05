"use client";

import { useSyncExternalStore } from "react";

import { INTRO_DONE_EVENT, isIntroDone } from "@/lib/loader/gate";

/**
 * True once the intro has finished — or immediately, when it was never going
 * to play, because the blocking head script presets the attribute in that case.
 *
 * Reveal animations depend on this. Without it they fire behind the curtain
 * and the page is already fully revealed by the time anyone can see it.
 */

function subscribe(onStoreChange: () => void) {
  document.addEventListener(INTRO_DONE_EVENT, onStoreChange);
  return () => document.removeEventListener(INTRO_DONE_EVENT, onStoreChange);
}

const getSnapshot = () => isIntroDone(document);

// The server cannot know, and guessing "done" would let reveals initialise
// before the gate exists. Waiting is the safe default.
const getServerSnapshot = () => false;

export function useIntroDone() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
