/**
 * The only hard-coded content on the site, for now.
 *
 * Deliberately a flat object and not a content layer. There is no CMS yet and
 * little real copy, so an abstraction over this would be an abstraction over
 * nothing.
 */
export const site = {
  /** Full legal name. Set as two lines so the display break is a decision,
   *  not whatever the viewport happens to do. */
  name: ["Richard Bright", "Asiedu-Bentum"],
  /** What the signature says, and what people actually call him. */
  knownAs: "Mckenzie",

  location: "Accra, Ghana",

  /**
   * The hero line.
   *
   * Philippians 4:13, then a hard turn. The verse is doing the setup and the
   * second clause is the punchline, which only lands because the first half is
   * quoted straight — so it is left exactly as the verse reads, and the comma
   * is the beat before the narrowing.
   *
   * The non-breaking space is deliberate. `text-balance` optimises for even
   * line lengths and knows nothing about meaning, and on a phone it broke the
   * quotation as "all things through / Christ". Binding the pair costs one
   * character and keeps the verse intact at every width.
   */
  intro:
    "I can do all things through\u00A0Christ, especially all things that involve systems.",

  /** TODO: confirm. Only one is verified. */
  roles: ["Software Engineer"],

  title: "Richard Bright Asiedu-Bentum — Software Engineer",
  description:
    "Software engineer in Accra. Portfolio, notes, and the reasoning behind both.",

  /** Sections do not all exist yet; the header degrades gracefully. */
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Notes", href: "#notes" },
    { label: "Contact", href: "#contact" },
  ],

  repo: "https://github.com/mckenzie-81/me",
} as const;
