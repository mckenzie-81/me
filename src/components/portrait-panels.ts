/**
 * The two shapes that host the portrait.
 *
 * These are not a decorative crop — they are the frame the artwork is set
 * into, so the numbers are measured rather than invented. They were read off
 * the Figma frame by fitting a straight line to the top and bottom edge of
 * each panel in the exported PNG, which is why the four corners of a panel do
 * not share a slope: the frames taper very slightly to the right. A single
 * `skewY()` would have been one line of CSS and visibly wrong.
 *
 * Percentages, not pixels, so the whole assembly scales with its column.
 *
 * The portrait itself stays upright. Only the frames lean — shearing the
 * image would tilt the eyes, and that reads as a mistake rather than a
 * composition.
 */
export type Point = readonly [x: number, y: number];

export const PORTRAIT_PANELS: readonly (readonly Point[])[] = [
  // Left panel: taller edge on the outside, cut away from the hairline.
  [
    [0, 13.0],
    [47.2, 7.1],
    [47.2, 92.0],
    [0, 100],
  ],
  // Right panel: the gap between the two falls down the centre of the face.
  [
    [52.8, 5.7],
    [100, 0],
    [100, 84.6],
    [52.8, 92.3],
  ],
];

/** Width / height of the whole two-panel assembly, from the same measurement. */
export const PORTRAIT_ASPECT = 214 / 227.4;

export function clipPath(points: readonly Point[]): string {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

/**
 * How the artwork sits inside the frames.
 *
 * Recovered rather than eyeballed: the asset was composited over the plate
 * colour at a range of scales and offsets and matched against the exported
 * frame, and these are the values that minimised the difference (mean error
 * 3.4 of 255). Figma had the portrait at 124% of the box and pushed up and
 * left, which is a tighter crop than `object-fit: cover` produces — enough
 * that the default read as a different photograph.
 *
 * Percentages of the assembly box, so the crop survives any column width.
 */
export const PORTRAIT_FIT = {
  width: 123.8,
  left: -3.3,
  top: -10.5,
} as const;
