import { describe, expect, it } from "vitest";

import {
  clipPath,
  PORTRAIT_ASPECT,
  PORTRAIT_FIT,
  PORTRAIT_PANELS,
  type Point,
} from "./portrait-panels";

const xs = (panel: readonly Point[]) => panel.map(([x]) => x);
const all = PORTRAIT_PANELS.flat();

describe("portrait panels", () => {
  it("is a diptych of quadrilaterals", () => {
    expect(PORTRAIT_PANELS).toHaveLength(2);
    for (const panel of PORTRAIT_PANELS) expect(panel).toHaveLength(4);
  });

  it("stays inside its box", () => {
    for (const [x, y] of all) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
  });

  it("fills the box it is given", () => {
    // If the shapes did not touch all four sides, the element would reserve
    // layout the artwork never uses and the hero column would look mis-set.
    expect(Math.min(...all.map(([x]) => x))).toBe(0);
    expect(Math.max(...all.map(([x]) => x))).toBe(100);
    expect(Math.min(...all.map(([, y]) => y))).toBe(0);
    expect(Math.max(...all.map(([, y]) => y))).toBe(100);
  });

  it("leaves a gap between the panels rather than overlapping", () => {
    const [left, right] = PORTRAIT_PANELS;
    const gap = Math.min(...xs(right)) - Math.max(...xs(left));
    expect(gap).toBeGreaterThan(2);
    expect(gap).toBeLessThan(10);
  });

  it("leans both panels the same way", () => {
    // The two frames read as one sheet that has been cut, so their edges have
    // to rise to the right together. Opposite leans would read as two photos.
    for (const panel of PORTRAIT_PANELS) {
      const [topLeft, topRight] = panel;
      expect(topRight[1]).toBeLessThan(topLeft[1]);
    }
  });

  it("is taller than it is wide", () => {
    expect(PORTRAIT_ASPECT).toBeLessThan(1);
  });

  it("crops in, and never leaves a frame edge bare", () => {
    // The artwork is scaled past the box and pulled up and left. If any of
    // these slipped the other way the plate colour would show as a bare strip
    // along an edge, which is the one failure that looks like a bug.
    expect(PORTRAIT_FIT.width).toBeGreaterThan(100);
    expect(PORTRAIT_FIT.left).toBeLessThanOrEqual(0);
    expect(PORTRAIT_FIT.top).toBeLessThanOrEqual(0);
    expect(PORTRAIT_FIT.left + PORTRAIT_FIT.width).toBeGreaterThanOrEqual(100);
  });

  it("formats a CSS polygon", () => {
    expect(clipPath([[0, 13], [47.2, 7.1]])).toBe("polygon(0% 13%, 47.2% 7.1%)");
  });
});
