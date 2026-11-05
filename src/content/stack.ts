import type { StackGroup } from "./types";

/** PLACEHOLDER CONTENT — group these however reflects how you actually work. */

export const stack: StackGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Go", "Python", "SQL"],
    order: 1,
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "GSAP", "Framer Motion"],
    order: 2,
  },
  {
    id: "backend",
    label: "Backend & data",
    items: ["Node.js", "PostgreSQL", "Prisma", "Redis", "REST", "tRPC"],
    order: 3,
  },
  {
    id: "infra",
    label: "Infrastructure",
    items: ["Docker", "GitHub Actions", "Vercel", "AWS", "Terraform"],
    order: 4,
  },
];
