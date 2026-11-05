import type { Project } from "./types";

/** PLACEHOLDER CONTENT — three entries to prove the layout at different lengths. */

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
      tagline: "Realtime logistics dashboard for a fleet operator",
    description:
      "A single screen that replaced four spreadsheets. Live vehicle positions, route exceptions and driver assignment in one view, built around a streaming layer that keeps a few hundred concurrent clients in sync without hammering the database.",
    year: "2025",
    role: "Lead engineer",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets", "Mapbox"],
    links: { live: "#", repo: "#" },
    featured: true,
    order: 1,
  },
  {
    slug: "ledgerline",
    title: "Ledgerline",
    tagline: "Invoicing and reconciliation for small studios",
    description:
      "Double-entry bookkeeping hidden behind an interface that never says the words 'double-entry bookkeeping'. Handles multi-currency, partial payments and the awkward edge cases that make accounting software feel hostile.",
    year: "2024",
    role: "Solo build",
    stack: ["React", "Node.js", "Prisma", "Stripe"],
    links: { live: "#", writeup: "#" },
    featured: true,
    order: 2,
  },
  {
    slug: "signalbox",
    title: "Signalbox",
    tagline: "Self-hosted uptime and log aggregation",
    description:
      "A small observability stack for projects that cannot justify a vendor bill. Ingests structured logs, runs scheduled probes, and alerts with enough context that you do not have to open a dashboard to know what broke.",
    year: "2024",
    role: "Solo build",
    stack: ["Go", "ClickHouse", "Docker", "Grafana"],
    links: { repo: "#" },
    featured: false,
    order: 3,
  },
];
