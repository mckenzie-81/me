/**
 * Selected work.
 *
 * A list rather than a field on `site`, because it is the one piece of content
 * that grows and reorders. Everything else there is a singleton.
 *
 * `reasoning` is the load-bearing field and the only one that is hard to
 * write. The hero claims an interest in the parts nobody sees and says every
 * decision is written down; an entry that lists features instead of the
 * problem quietly withdraws that claim. So the shape asks for the constraint,
 * not the feature set — if an entry cannot answer "what was actually hard", it
 * is not ready to be here.
 */
export type WorkStatus = "live" | "in progress" | "early" | "archived";

export type WorkEntry = {
  name: string;
  status: WorkStatus;
  /** A second status word, e.g. "multiplayer". Optional and rare. */
  note?: string;
  /** What it is, in one sentence, for someone who has never heard of it. */
  what: string;
  /** The hard part. The constraint, the approach that failed, the trade. */
  reasoning: string;
  stack: readonly string[];
  year: string;
  /** Shown as the bare host, which is more legible than "Visit site". */
  href?: string;
  source?: string;
};

/**
 * Empty until the real entries land. The section renders nothing rather than
 * a scaffold of placeholders — an empty state is honest, a fake one is not.
 */
export const work: readonly WorkEntry[] = [];
