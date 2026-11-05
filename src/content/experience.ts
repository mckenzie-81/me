import type { ExperienceItem } from "./types";

/** PLACEHOLDER CONTENT — replace with your own history. */

export const experience: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "Company Name",
    role: "Senior Software Engineer",
    start: "2024",
    end: null,
    location: "Remote",
    summary:
      "Own the web platform end to end: product surface, API layer and the deployment pipeline behind both.",
    highlights: [
      "Cut median page load from 4.1s to 900ms by moving rendering server-side and reworking the data access layer.",
      "Introduced a typed contract between frontend and API, removing a recurring class of runtime bugs.",
      "Mentored two engineers through their first production launches.",
    ],
    order: 1,
  },
  {
    id: "exp-2",
    company: "Previous Company",
    role: "Software Engineer",
    start: "2022",
    end: "2024",
    location: "Accra, Ghana",
    summary:
      "Built customer-facing features on a product used by teams across three markets.",
    highlights: [
      "Shipped the billing rework that unblocked expansion into two new regions.",
      "Reduced the test suite from 22 minutes to under 5 without dropping coverage.",
    ],
    order: 2,
  },
];
