import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "./Wordmark";
import { WORDMARK_LETTERS } from "./wordmark-data";

describe("Wordmark", () => {
  it("exposes the word as an accessible name", () => {
    // The wordmark is the only content on screen during the intro. If it is
    // not announced, a screen reader user gets a blank page.
    render(<Wordmark word="mckenzie" />);
    expect(screen.getByRole("img", { name: "mckenzie" })).toBeInTheDocument();
  });

  it("renders one path per letter so they can be drawn in sequence", () => {
    const { container } = render(<Wordmark word="mckenzie" />);
    expect(container.querySelectorAll("path[data-letter]")).toHaveLength(
      WORDMARK_LETTERS.length,
    );
  });

  it("draws as outlines, not fills", () => {
    // The stroke-draw depends on this: a filled glyph has nothing to trace.
    const { container } = render(<Wordmark word="mckenzie" />);
    const path = container.querySelector("path[data-letter]");
    expect(path).toHaveAttribute("fill", "none");
  });

  it("applies caller styling without dropping its own classes", () => {
    const { container } = render(<Wordmark word="mckenzie" className="w-80" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-80");
    expect(svg).toHaveClass("overflow-visible");
  });
});
