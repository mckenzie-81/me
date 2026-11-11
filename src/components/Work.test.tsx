import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Work } from "./Work";
import type { WorkEntry } from "@/work";

const entry = (over: Partial<WorkEntry> = {}): WorkEntry => ({
  name: "Thing",
  status: "live",
  what: "A thing that does a thing.",
  reasoning: "The hard part was state.",
  role: "Built it solo",
  fields: ["backend"],
  stack: ["Next.js"],
  year: "2026",
  ...over,
});

describe("<Work />", () => {
  it("renders nothing at all when there are no entries", () => {
    // An empty section still paints a heading and a rule, which reads as a
    // section that failed to load rather than one not written yet.
    const { container } = render(<Work entries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists every entry, numbered", () => {
    render(
      <Work entries={[entry({ name: "One" }), entry({ name: "Two" })]} />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("splits the reasoning into words for the scroll to resolve", () => {
    const { container } = render(
      <Work entries={[entry({ reasoning: "one two three four" })]} />,
    );
    expect(container.querySelectorAll("[data-word]")).toHaveLength(4);
  });

  it("keeps the reasoning readable as a sentence", () => {
    // Splitting must not eat the spaces: copied out, it has to be prose.
    render(<Work entries={[entry({ reasoning: "one two three" })]} />);
    expect(screen.getByRole("listitem").textContent).toContain("one two three");
  });

  it("accents only what is live", () => {
    const { container } = render(
      <Work
        entries={[
          entry({ name: "Shipped", status: "live" }),
          entry({ name: "Not yet", status: "prototype" }),
        ]}
      />,
    );
    const [live, early] = [...container.querySelectorAll("li")];
    expect(within(live).getByText("live").className).toContain("text-accent");
    expect(within(early).getByText("prototype").className).toContain(
      "text-muted",
    );
  });

  it("names a link by where it goes, not by what to do", () => {
    render(<Work entries={[entry({ href: "https://www.example.africa/x" })]} />);
    expect(
      screen.getByRole("link", { name: "example.africa" }),
    ).toBeInTheDocument();
  });

  it("opens outbound links safely", () => {
    render(
      <Work
        entries={[
          entry({
            href: "https://example.com",
            source: "https://github.com/a/b",
          }),
        ]}
      />,
    );
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument();
  });

  it("shows the year alone when nothing is built yet", () => {
    // Research entries have no stack. Joining "stack · year" blindly would
    // print a dangling separator before the year.
    render(<Work entries={[entry({ stack: [], year: "2026" })]} />);
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.queryByText(/^ ?· ?2026/)).toBeNull();
  });

  it("says what he actually did on each one", () => {
    // Without this a client project reads as if he built all of it alone.
    render(<Work entries={[entry({ role: "Project lead" })]} />);
    expect(screen.getByText("Project lead")).toBeInTheDocument();
  });

  it("leads with featured entries, keeping hand-written order within them", () => {
    render(
      <Work
        entries={[
          entry({ name: "Plain" }),
          entry({ name: "First", featured: true }),
          entry({ name: "Second", featured: true }),
        ]}
      />,
    );
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["First", "Second", "Plain"]);
  });

  it("marks each entry for its own scroll trigger", () => {
    const { container } = render(
      <Work entries={[entry({ name: "A" }), entry({ name: "B" })]} />,
    );
    // One trigger per entry, not one for the section: otherwise the last
    // entry resolves while it is still off screen.
    expect(container.querySelectorAll("[data-entry]")).toHaveLength(2);
  });
});
