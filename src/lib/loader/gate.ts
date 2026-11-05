/**
 * The intro gate.
 *
 * Scroll-triggered reveals in the first viewport fire as soon as ScrollTrigger
 * initialises — which, during the intro, is while the curtain still covers the
 * page. The curtain then lifts on a hero that has already finished animating.
 *
 * So reveals wait on this gate. State lives on `<html>` rather than in a module
 * variable for one specific reason: the blocking script in the document head
 * can set the attribute directly when the intro is being skipped, which
 * unblocks everything before React has hydrated — no flash, no wasted frame.
 */

export const INTRO_DONE_EVENT = "intro:done";
const DONE = "done";

export function isIntroDone(doc: Document): boolean {
  return doc.documentElement.dataset.introState === DONE;
}

export function markIntroDone(doc: Document): void {
  // Idempotent. The real completion callback and the safety timeout can both
  // fire; replaying every gated animation because of that would be worse than
  // the bug the timeout exists to prevent.
  if (isIntroDone(doc)) return;

  doc.documentElement.dataset.introState = DONE;
  doc.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
}
