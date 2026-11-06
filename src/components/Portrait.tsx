import Image from "next/image";

import {
  clipPath,
  PORTRAIT_ASPECT,
  PORTRAIT_FIT,
  PORTRAIT_PANELS,
} from "./portrait-panels";

/**
 * The portrait, set into its two host shapes.
 *
 * One box, two clipped panels, the same artwork drawn full-bleed in each. The
 * panels never move relative to one another, so the face reads as continuous
 * and the gap looks like a cut rather than a seam.
 *
 * Two elements rather than one element with a two-subpath SVG clip, because
 * the halves are the obvious thing to drift apart on scroll later, and a
 * single clipped element cannot be taken apart again.
 *
 * The crop is not `object-fit: cover`. The frame was designed around a
 * tighter one, so the fit is carried as measured percentages instead.
 *
 * The plate colour lives behind the artwork rather than inside it. The asset
 * is a cut-out with a transparent background, so the surface the portrait
 * sits on is a token and follows the theme. Baking the grey into the file
 * would have pinned one lighting decision into a binary.
 */
export function Portrait() {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: PORTRAIT_ASPECT }}
    >
      {PORTRAIT_PANELS.map((panel, i) => (
        <div
          key={i}
          data-enter
          className="absolute inset-0 bg-plate"
          style={{ clipPath: clipPath(panel) }}
        >
          <Image
            src="/portrait.webp"
            /**
             * Empty alt on purpose, and doubly so here. The portrait sits
             * beside an <h1> carrying the same name, and there are two <img>
             * elements for one face — described, it would announce the
             * identity twice over. If the artwork ever moves away from the
             * name, one of these needs real alt text and the other must stay
             * empty.
             */
            alt=""
            width={860}
            height={890}
            /** Above the fold: the largest thing the curtain lifts onto. */
            priority
            /**
             * The rendered width is the box times PORTRAIT_FIT.width, not the
             * box. Quoting the box here would have Next serve a file a
             * quarter too small for the crop.
             */
            sizes="(min-width: 768px) 420px, (min-width: 390px) 175px, 45vw"
            className="absolute h-auto max-w-none"
            style={{
              width: `${PORTRAIT_FIT.width}%`,
              left: `${PORTRAIT_FIT.left}%`,
              top: `${PORTRAIT_FIT.top}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
