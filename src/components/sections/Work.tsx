import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/anim/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/content/types";

function ProjectLinks({ links }: { links: Project["links"] }) {
  const entries = [
    links.live && { label: "Live", href: links.live },
    links.repo && { label: "Source", href: links.repo },
    links.writeup && { label: "Write-up", href: links.writeup },
  ].filter(Boolean) as { label: string; href: string }[];

  if (!entries.length) return null;

  return (
    <ul className="flex flex-wrap items-center gap-4">
      {entries.map((entry) => (
        <li key={entry.label}>
          <a
            href={entry.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group/link inline-flex items-center gap-1 font-mono text-xs text-ink-soft transition-colors hover:text-blue"
          >
            {entry.label}
            <ArrowUpRight
              aria-hidden
              className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  return (
    <Section id="work">
      <div className="flex flex-col gap-16">
        <SectionHeading eyebrow="01 — Work" title="Selected projects" />

        <ol className="flex flex-col">
          {projects.map((project, index) => (
            <Reveal
              key={project.slug}
              as="li"
              className="group border-t border-rule py-10 last:border-b"
            >
              <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span
                    aria-hidden
                    className="font-mono text-xs text-ink-faint tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-blue sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="text-sm text-ink-faint">{project.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 md:col-span-6">
                  <p className="leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                  <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md bg-raised px-2 py-1 font-mono text-[11px] text-ink-soft"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <ProjectLinks links={project.links} />
                </div>

                <div className="flex flex-col gap-1 font-mono text-xs text-ink-faint md:col-span-2 md:items-end md:text-right">
                  <span>{project.year}</span>
                  <span>{project.role}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
