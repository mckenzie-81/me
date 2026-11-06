import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Portrait } from "./Portrait";
import { clipPath, PORTRAIT_PANELS } from "./portrait-panels";

describe("<Portrait />", () => {
  it("draws the artwork once per host shape", () => {
    const { container } = render(<Portrait />);
    expect(container.querySelectorAll("img")).toHaveLength(
      PORTRAIT_PANELS.length,
    );
  });

  it("clips each panel to its own shape", () => {
    const { container } = render(<Portrait />);
    const styles = [...container.querySelectorAll<HTMLElement>("[data-enter]")]
      .map((el) => el.getAttribute("style") ?? "");

    expect(styles).toHaveLength(PORTRAIT_PANELS.length);
    for (const [i, panel] of PORTRAIT_PANELS.entries()) {
      expect(styles[i]).toContain(clipPath(panel));
    }
  });

  it("is invisible to screen readers", () => {
    // Two images, one face, and the name is already an <h1> next to it.
    render(<Portrait />);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("holds its space before the artwork loads", () => {
    // Without a reserved box the hero reflows when the portrait arrives,
    // which is the one layout shift the curtain cannot hide.
    const { container } = render(<Portrait />);
    expect(container.firstElementChild?.getAttribute("style")).toMatch(
      /aspect-ratio/,
    );
  });
});
