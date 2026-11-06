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
  /** The header mark. Short on purpose. */

  location: "Accra, Ghana",

  /**
   * The hero line. Dry rather than earnest, and pointed at the engineering
   * rather than the output — it is the sentence the rest of the site has to
   * earn. Placeholder status: chosen to ship, expected to change.
   *
   * Typographic apostrophe, not a straight quote: at display size the
   * difference is obvious.
   */
  intro: "I\u2019m unreasonably invested in the parts you will never see.",

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

  repo: "https://github.com/",
} as const;
