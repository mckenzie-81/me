import type { Profile, SiteMeta } from "./types";

/**
 * PLACEHOLDER CONTENT — replace with your own.
 * Everything here is editable through /cms later.
 */

export const siteMeta: SiteMeta = {
  url: "https://example.com",
  title: "Mckenzie — Software Engineer",
  description:
    "Software engineer building fast, considered web products. Selected work, experience and contact.",
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
};

export const profile: Profile = {
  name: "Richard Bright Asiedu-Bentum",
  knownAs: "Mckenzie",
  role: "Software Engineer",
  location: "Accra, Ghana",
  blurb:
    "I build web products end to end — interfaces that feel immediate and the systems that keep them honest.",
  about: [
    "I'm a software engineer focused on the web. Most of my work sits where interface detail meets real system constraints: making something feel instant while it is doing genuine work underneath.",
    "I care about the parts users never see directly — the data model that stops a feature from becoming a rewrite, the loading state that admits it is loading, the animation that gets out of the way. Craft is mostly a sequence of unglamorous decisions.",
    "Outside of shipping, I read other people's codebases, over-engineer side projects, and keep a long list of things I intend to rewrite from scratch.",
  ],
  email: "richardbrightasiedu@gmail.com",
  available: true,
  availabilityNote: "Open to new work",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/in/" },
    { label: "X", href: "https://x.com/" },
  ],
  resumeUrl: undefined,
};
