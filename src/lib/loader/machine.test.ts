import { describe, expect, it } from "vitest";

import {
  initialLoaderState,
  isIntroVisible,
  loaderReducer,
  type LoaderPhase,
} from "./machine";

/**
 * The loader's phases are driven by animation callbacks, which means the events
 * arrive from four different GSAP timelines over about two seconds. A pure
 * reducer is the only part of that worth testing — and the only part where an
 * ordering bug would strand a visitor behind a full-screen overlay.
 */

describe("loaderReducer", () => {
  it("starts idle", () => {
    expect(initialLoaderState.phase).toBe("idle");
  });

  it("runs the happy path: idle -> drawing -> settling -> lifting -> done", () => {
    let state = initialLoaderState;

    state = loaderReducer(state, { type: "START" });
    expect(state.phase).toBe("drawing");

    state = loaderReducer(state, { type: "DRAW_COMPLETE" });
    expect(state.phase).toBe("settling");

    state = loaderReducer(state, { type: "SETTLE_COMPLETE" });
    expect(state.phase).toBe("lifting");

    state = loaderReducer(state, { type: "LIFT_COMPLETE" });
    expect(state.phase).toBe("done");
  });

  it("ignores events that do not belong to the current phase", () => {
    // A stray DRAW_COMPLETE before START must not skip the draw.
    const state = loaderReducer(initialLoaderState, { type: "DRAW_COMPLETE" });
    expect(state.phase).toBe("idle");
  });

  it("returns the identical state object when an event is ignored", () => {
    // Identity matters: React bails out of a re-render when useReducer returns
    // the same reference. A new object with the same phase would re-render the
    // whole tree on every stray callback.
    const state = loaderReducer(initialLoaderState, { type: "LIFT_COMPLETE" });
    expect(state).toBe(initialLoaderState);
  });

  it("SKIP jumps straight to done from any phase", () => {
    const phases: LoaderPhase[] = ["idle", "drawing", "settling", "lifting"];

    for (const phase of phases) {
      expect(loaderReducer({ phase }, { type: "SKIP" }).phase).toBe("done");
    }
  });

  it("is terminal: nothing moves it out of done", () => {
    const done = loaderReducer({ phase: "lifting" }, { type: "LIFT_COMPLETE" });

    expect(loaderReducer(done, { type: "START" })).toBe(done);
    expect(loaderReducer(done, { type: "SKIP" })).toBe(done);
    expect(loaderReducer(done, { type: "DRAW_COMPLETE" })).toBe(done);
  });

  it("cannot be restarted once it has begun", () => {
    // Strict Mode mounts effects twice in development. A second START must not
    // replay the intro.
    const drawing = loaderReducer(initialLoaderState, { type: "START" });
    const again = loaderReducer(drawing, { type: "START" });

    expect(again).toBe(drawing);
  });
});

describe("isIntroVisible", () => {
  it("is visible in every phase except done", () => {
    expect(isIntroVisible("idle")).toBe(true);
    expect(isIntroVisible("drawing")).toBe(true);
    expect(isIntroVisible("settling")).toBe(true);
    expect(isIntroVisible("lifting")).toBe(true);
    expect(isIntroVisible("done")).toBe(false);
  });
});
