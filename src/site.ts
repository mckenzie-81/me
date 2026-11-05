/**
 * The only hard-coded content on the site, for now.
 *
 * Deliberately a flat object and not a content layer. There is no CMS yet and
 * no real copy, so an abstraction over this would be an abstraction over
 * nothing — that was the mistake in the last pass.
 */
export const site = {
  /** Full legal name. */
  name: "Richard Bright Asiedu-Bentum",
  /** What the signature says, and what people actually call him. */
  knownAs: "Mckenzie",
  title: "Mckenzie — Software Engineer",
  description: "Software engineer. Portfolio.",
} as const;
