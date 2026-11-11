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

/**
 * Honest states, not marketing ones. "early", "prototype" and "pre-launch"
 * exist so an entry never has to overclaim to earn its place; only `live`
 * means a stranger can use it right now, which is why it is the only one that
 * takes the accent.
 */
export type WorkStatus =
  | "live"
  | "pre-launch"
  | "prototype"
  | "early"
  | "in progress"
  | "archived";

export type WorkEntry = {
  name: string;
  status: WorkStatus;
  /** A qualifier on the status, e.g. "client project". Optional. */
  note?: string;
  /** What it is, in one sentence, for someone who has never heard of it. */
  what: string;
  /** The hard part. The constraint, the approach that failed, the trade. */
  reasoning: string;
  /**
   * What he actually did. Load-bearing on a portfolio carrying client work,
   * where "shipped a ride-hailing platform" and "led eight developers
   * building one" are very different claims and the page should not let a
   * reader guess which is meant.
   */
  role: string;
  /** Broad areas, for scanning. Narrower than a category, wider than a tool. */
  fields: readonly string[];
  /** May be empty: research that has not been built yet has no stack, and
   *  inventing one would be the first dishonest line on the page. */
  stack: readonly string[];
  year: string;
  /**
   * Gets the full treatment. Everything is featured today, so this only
   * orders the list; the compact row for everything else gets designed when
   * there is a real entry to design it against, not before.
   */
  featured?: boolean;
  /** Shown as the bare host, which is more legible than "Visit site". */
  href?: string;
  source?: string;
};

export const work: readonly WorkEntry[] = [
  {
    name: "Cend",
    status: "pre-launch",
    note: "client project",
    what: "Ride-hailing platform with rider and driver apps, an admin dashboard and a microservices backend.",
    // TODO: the "why" is missing. We started on PostGIS, experimented with
    // Uber H3, and considered standardising on it — because of what? That
    // clause is the whole point of the entry; until it lands the sentence
    // stops at what is actually true.
    reasoning:
      "Service languages followed what each team member did best, which kept eight developers moving. The one deliberate technical decision was spatial: we started on PostGIS, experimented with Uber H3, and considered standardising on it.",
    role: "Project lead; designed the architecture",
    fields: ["mobile", "backend", "frontend"],
    stack: ["React Native", "Java Spring Boot", "Python", "PostGIS"],
    year: "2025", // TODO: confirm
    featured: true,
  },
  {
    name: "Diya Impact Foundation",
    status: "live",
    note: "pro bono client",
    what: "Website for a nonprofit working in health, education and entrepreneurship.",
    // TODO: a concrete technique for keeping it fast. Without one the entry
    // claims an experiment in performance and then reports no result, which
    // is the weakest thing an entry here can do.
    reasoning:
      "An experiment in how much motion and 3D a page can carry before performance suffers, using GSAP for animation, Lenis for scroll and Three.js for the 3D scene.",
    role: "Built the frontend", // TODO: confirm
    fields: ["frontend", "design"],
    stack: ["GSAP", "Lenis", "Three.js"], // TODO: add Next.js if true
    year: "2025",
    featured: true,
    href: "https://www.diyaimpactfoundation.org/",
  },
  {
    name: "Tamper-Evident e-Voting",
    status: "prototype",
    note: "not deployed",
    what: "Online voting for student union elections where tampering is detectable even if the database is compromised.",
    reasoning:
      "A hash chain inside the database can be edited and recomputed, so checkpoints are stored outside it. It protects against database-level compromise, not against someone who controls the server.",
    role: "Designed and built solo",
    fields: ["backend", "security", "frontend"],
    stack: ["Go", "PostgreSQL", "Next.js"],
    year: "2026", // TODO: confirm
    featured: true,
  },
  {
    name: "IFRS 18 Transition Tooling",
    status: "early",
    note: "research and design",
    what: "Design for a tool that maps income statements prepared under IAS 1 to the IFRS 18 structure.",
    reasoning:
      "From 2027 IFRS 18 puts every income and expense line into fixed categories, so old statements must be reclassified. The design proposes a category for each line, flags low-confidence ones for human review, and records every decision in a tamper-evident trail.",
    role: "Research and design",
    fields: ["data"],
    // Deliberately empty: nothing is built yet.
    stack: [],
    year: "2026",
  },
];
