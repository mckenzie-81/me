"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { work, type WorkEntry } from "@/work";

/**
 * Selected work.
 *
 * Two-column on desktop: the name, status and metadata hold the left axis the
 * hero established, and the reasoning takes the open right-hand column. Left
 * ranged on mobile rather than centred like the hero — the hero is a title
 * block and this is reading matter, and centred body copy costs the reader a
 * new left edge on every line.
 *
 * The reasoning fades in word by word against the scroll. It is the one piece
 * of motion on the page tied to reading rather than to arrival, which is why
 * it is scrubbed: it tracks the scroll position both ways instead of firing
 * once and being over. Lenis smooths the input, so the words resolve on the
 * eased position rather than on raw wheel deltas.
 */
export function Work({ entries = work }: { entries?: readonly WorkEntry[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        for (const entry of gsap.utils.toArray<HTMLElement>(
          "[data-entry]",
          ref.current,
        )) {
          const words = entry.querySelectorAll("[data-word]");
          if (!words.length) continue;

          gsap.to(words, {
            opacity: 1,
            // Linear: the scrub already maps scroll to progress, and easing on
            // top of it makes the words appear to drift against the scroll.
            ease: "none",
            // Duration is what makes this read as a gradient instead of a
            // wipe. Each word takes `duration` to resolve while the next
            // starts `stagger` later, so roughly duration/stagger words are
            // in flight at once — measured at the default 0.9 only two were,
            // which looks like a hard edge travelling down the paragraph.
            duration: 3,
            stagger: 0.4,
            scrollTrigger: {
              trigger: entry,
              start: "top 78%",
              end: "bottom 65%",
              scrub: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  // Nothing to show is a valid state while the entries are being written.
  if (!entries.length) return null;

  // Array.prototype.sort is stable per spec, so entries that are equally
  // featured keep the order they were written in — the list stays editable by
  // hand rather than being silently rearranged.
  const ordered = [...entries].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
  );

  return (
    <section id="work" ref={ref} className="py-28 md:py-40">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-5">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-semibold tracking-[-0.03em]">
            Work
          </h2>
          {/* The count is deliberately not stated. "Selected" is a claim about
              editing; a number would turn it into a claim about volume. */}
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Selected, not exhaustive
          </p>
        </div>

        <ol>
          {ordered.map((entry, i) => (
            <Entry key={entry.name} entry={entry} index={i + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Entry({ entry, index }: { entry: WorkEntry; index: number }) {
  return (
    <li
      data-entry
      className="grid gap-5 border-b border-rule py-12 md:grid-cols-12 md:gap-8 md:py-16"
    >
      <div className="md:col-span-4">
        <div className="flex items-baseline gap-3">
          <span className="text-xs text-muted tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          {/* Balanced, so a hyphenated name breaks at its space rather than
              after the hyphen — "Tamper-Evident e- / Voting" is a worse line
              than "Tamper-Evident / e-Voting", and balancing prefers the
              evener pair without needing a non-breaking hyphen the typeface
              may not carry. */}
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-balance sm:text-3xl">
            {entry.name}
          </h3>
        </div>

        <p className="mt-2 ml-8 text-sm text-muted">{entry.what}</p>

        <Status status={entry.status} note={entry.note} />

        {/* The role is a claim, not metadata: on a page carrying client work,
            "shipped a ride-hailing platform" and "led eight developers
            building one" are different sentences and the reader should not
            have to guess which is meant. So it is set in ink, not muted. */}
        <p className="mt-3 ml-8 text-sm text-ink">{entry.role}</p>

        <p className="mt-1 ml-8 text-xs text-muted">
          {entry.fields.join(" · ")}
        </p>
      </div>

      <div className="md:col-span-7 md:col-start-6">
        <p className="text-lg leading-relaxed text-balance sm:text-xl">
          <Words text={entry.reasoning} />
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {/* Joined as one list rather than "stack · year", so an entry with
              nothing built yet shows the year alone instead of a dangling
              separator. */}
          <span>{[...entry.stack, entry.year].join(" · ")}</span>
          {entry.href && <External href={entry.href} />}
          {entry.source && <External href={entry.source} label="Source" />}
        </div>
      </div>
    </li>
  );
}

/**
 * Word-by-word, so the scroll has something to resolve.
 *
 * Inline spans rather than `inline-block`: an inline-block word cannot be
 * broken across a line and changes how the browser justifies the paragraph,
 * which is a visible cost for an effect that only needs opacity.
 *
 * The dimmed start lives in CSS behind `[data-animate="true"]`, the same
 * pre-paint flag the hero uses. Without JavaScript, or with reduced motion,
 * the paragraph renders at full strength and nothing has to undo anything.
 */
function Words({ text }: { text: string }) {
  const words = text.split(" ");

  return words.map((word, i) => (
    <span key={`${word}-${i}`}>
      <span data-word>{word}</span>
      {i < words.length - 1 ? " " : ""}
    </span>
  ));
}

function Status({ status, note }: { status: WorkEntry["status"]; note?: string }) {
  return (
    <p className="mt-4 ml-8 text-xs tracking-[0.16em] uppercase">
      {/* Only "live" earns the accent. If every status were coloured the
          colour would stop meaning "you can use this right now". */}
      <span className={status === "live" ? "text-accent" : "text-muted"}>
        {status}
      </span>
      {note && <span className="text-muted"> · {note}</span>}
    </p>
  );
}

function External({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
    >
      {/* The bare host reads as a destination; "Visit site" reads as a button
          and hides where it goes. */}
      {label ?? new URL(href).host.replace(/^www\./, "")}
    </a>
  );
}
