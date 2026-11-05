/**
 * Content model for the site.
 *
 * These types are the contract between the public page and whatever
 * eventually backs the /cms. The page renders these shapes and nothing else,
 * so moving from local files to a database is a change in `src/lib/content.ts`
 * only — no component has to be touched.
 */

export type SocialLink = {
  label: string;
  href: string;
};

export type Profile = {
  /** Full legal name. Used in the hero, metadata and the footer byline. */
  name: string;
  /**
   * What people actually call you. Drives the loader wordmark and the header
   * mark — the places where a four-part legal name would not fit or would read
   * as formal. Kept as its own field rather than derived from `name`, because
   * no split of "Richard Bright Asiedu-Bentum" produces "Mckenzie".
   */
  knownAs: string;
  /** Short professional title, e.g. "Software Engineer". */
  role: string;
  /** City / region, shown in the hero meta row. */
  location: string;
  /** One or two sentences. Rendered as the hero sub-paragraph. */
  blurb: string;
  /** Longer narrative for the About section. One string per paragraph. */
  about: string[];
  email: string;
  /** Whether to show the "open to work" indicator. */
  available: boolean;
  /** Free text shown next to the availability dot. */
  availabilityNote: string;
  socials: SocialLink[];
  /** Path or URL to a downloadable CV. Optional. */
  resumeUrl?: string;
};

export type Project = {
  /** Stable identifier. Also the anchor id and future CMS primary key. */
  slug: string;
  title: string;
  /** One line. Sits directly under the title. */
  tagline: string;
  /** A paragraph of context: the problem, the approach, the outcome. */
  description: string;
  /** Display string, not a date — "2025", "2024—2025" are both fine. */
  year: string;
  /** Your part in it, e.g. "Solo build", "Lead engineer". */
  role: string;
  stack: string[];
  links: {
    live?: string;
    repo?: string;
    writeup?: string;
  };
  /** Pulled to the top of the Work section. */
  featured: boolean;
  /** Lower sorts first. */
  order: number;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  /** Display strings so the CMS never has to deal with date pickers. */
  start: string;
  /** `null` renders as "Present". */
  end: string | null;
  location: string;
  summary: string;
  /** Bullet points. Keep them outcome-shaped, not duty-shaped. */
  highlights: string[];
  order: number;
};

export type StackGroup = {
  id: string;
  /** e.g. "Languages", "Backend", "Infrastructure". */
  label: string;
  items: string[];
  order: number;
};

export type SiteMeta = {
  /** Canonical origin, no trailing slash. Drives metadata + OG urls. */
  url: string;
  title: string;
  description: string;
  /** Section anchors rendered in the header nav, in order. */
  nav: { label: string; href: string }[];
};
