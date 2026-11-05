import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "./Wordmark";

describe("Wordmark", () => {
  it("exposes the word as an accessible name", () => {
    // During the intro this is the only thing on screen. Unlabelled, a screen
    // reader user gets a blank page.
    render(<Wordmark word="Mckenzie" />);
    expect(screen.getByRole("img", { name: "Mckenzie" })).toBeInTheDocument();
  });

  it("renders the signature as a single filled path", () => {
    // The signature is a monoline script: one filled outline, not strokes.
    const { container } = render(<Wordmark word="Mckenzie" />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0]).toHaveAttribute("fill", "currentColor");
  });

  it("is fully visible by default", () => {
    // Reused outside the intro (header, footer) it must just render, with no
    // clip waiting on an animation that will never run.
    const { container } = render(<Wordmark word="Mckenzie" />);
    expect(container.querySelector("[data-wipe]")).toBeNull();
    expect(container.querySelector("path")).not.toHaveAttribute("clip-path");
  });

  it("starts fully hidden when it is going to be written on", () => {
    const { container } = render(<Wordmark word="Mckenzie" reveal />);
    const wipe = container.querySelector("[data-wipe]");

    expect(wipe).not.toBeNull();
    // Zero width = nothing revealed. The Intro animates this outwards.
    expect(wipe).toHaveAttribute("width", "0");
    expect(container.querySelector("path")).toHaveAttribute("clip-path");
  });

  it("gives each instance its own clip id", () => {
    // SVG ids are document-global. Two wordmarks sharing a clipPath id means
    // the second one silently drives the first one's clip.
    const { container } = render(
      <>
        <Wordmark word="Mckenzie" reveal />
        <Wordmark word="Mckenzie" reveal />
      </>,
    );
    const [a, b] = [...container.querySelectorAll("clipPath")];
    expect(a.id).not.toBe(b.id);
    expect(a.id).toBeTruthy();
  });

  it("applies caller styling without dropping its own classes", () => {
    const { container } = render(<Wordmark word="Mckenzie" className="w-80" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-80");
    expect(svg).toHaveClass("overflow-visible");
  });
});
