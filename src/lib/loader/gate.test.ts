import { beforeEach, describe, expect, it, vi } from "vitest";

import { INTRO_DONE_EVENT, isIntroDone, markIntroDone } from "./gate";

/**
 * Without a gate, every scroll-triggered reveal in the viewport fires while the
 * curtain is still covering the page. The curtain then lifts on a hero that has
 * already finished animating — the entrance is spent on an audience of nobody.
 */

describe("intro gate", () => {
  beforeEach(() => {
    delete document.documentElement.dataset.introState;
  });

  it("reports not-done before the intro finishes", () => {
    expect(isIntroDone(document)).toBe(false);
  });

  it("reports done once marked", () => {
    markIntroDone(document);
    expect(isIntroDone(document)).toBe(true);
  });

  it("records state on the document element so a blocking script can preset it", () => {
    // The inline head script sets this attribute directly when the intro is
    // skipped, so reveals are unblocked before React has even hydrated.
    document.documentElement.dataset.introState = "done";
    expect(isIntroDone(document)).toBe(true);
  });

  it("notifies subscribers exactly once per completion", () => {
    const listener = vi.fn();
    document.addEventListener(INTRO_DONE_EVENT, listener);

    markIntroDone(document);
    expect(listener).toHaveBeenCalledTimes(1);

    document.removeEventListener(INTRO_DONE_EVENT, listener);
  });

  it("does not re-notify if marked again", () => {
    // Strict Mode double-invocation, or a safety timeout racing the real
    // completion, must not replay every gated animation.
    const listener = vi.fn();
    markIntroDone(document);

    document.addEventListener(INTRO_DONE_EVENT, listener);
    markIntroDone(document);

    expect(listener).not.toHaveBeenCalled();
    document.removeEventListener(INTRO_DONE_EVENT, listener);
  });
});
