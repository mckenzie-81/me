/**
 * The intro loader as an explicit state machine.
 *
 * The phases are advanced by GSAP completion callbacks firing from several
 * timelines over roughly two seconds, plus a safety timeout, plus React Strict
 * Mode invoking effects twice in development. That is a lot of ways for events
 * to arrive out of order, and the failure mode is the worst one available:
 * a visitor stranded behind a full-screen overlay.
 *
 * A transition table makes the legal moves exhaustive and obvious, and makes
 * every illegal move a no-op by construction rather than by remembering to
 * guard it.
 */

export type LoaderPhase =
  /** Mounted, nothing decided yet. */
  | "idle"
  /** Letter outlines tracing in. */
  | "drawing"
  /** Word complete, ink filling, brief hold. */
  | "settling"
  /** Curtains rising. */
  | "lifting"
  /** Gone. Scroll unlocked, page interactive. Terminal. */
  | "done";

export type LoaderState = { phase: LoaderPhase };

export type LoaderEvent =
  | { type: "START" }
  | { type: "DRAW_COMPLETE" }
  | { type: "SETTLE_COMPLETE" }
  | { type: "LIFT_COMPLETE" }
  /** Reduced motion, a repeat visit, or the safety timeout. */
  | { type: "SKIP" };

export const initialLoaderState: LoaderState = { phase: "idle" };

const TRANSITIONS: Record<
  LoaderPhase,
  Partial<Record<LoaderEvent["type"], LoaderPhase>>
> = {
  idle: { START: "drawing", SKIP: "done" },
  drawing: { DRAW_COMPLETE: "settling", SKIP: "done" },
  settling: { SETTLE_COMPLETE: "lifting", SKIP: "done" },
  lifting: { LIFT_COMPLETE: "done", SKIP: "done" },
  // Terminal on purpose. Once the page is visible, nothing may cover it again.
  done: {},
};

export function loaderReducer(
  state: LoaderState,
  event: LoaderEvent,
): LoaderState {
  const next = TRANSITIONS[state.phase][event.type];

  // Returning the *same object* for an ignored event is deliberate, not an
  // optimisation detail: useReducer bails out of re-rendering when the
  // reference is unchanged, so stray callbacks cost nothing.
  return next ? { phase: next } : state;
}

export function isIntroVisible(phase: LoaderPhase): boolean {
  return phase !== "done";
}
