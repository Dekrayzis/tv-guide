import type { Rand } from "../../lib/random";

/** Every scene is drawn on a 240 × 80 canvas, then cropped to fit. */
export const W = 240;
export const H = 80;

/** What a scene is drawn with: its seeded randomness, the channel's colour, and unique gradient ids. */
export type Paint = { rand: Rand; tint: string; id: (name: string) => string };

/** A random number between `lo` and `hi`. */
export const between = (rand: Rand, lo: number, hi: number) => lo + rand() * (hi - lo);

/** A jagged or rolling skyline across the full width, as a closed path. */
export function ridge(rand: Rand, base: number, height: number, steps: number, smooth: boolean) {
  const points = Array.from({ length: steps + 1 }, (_, i) => [(i / steps) * W, base - rand() * height] as const);
  const line = smooth
    ? points.map(([x, y], i) => (i ? `S${x - W / steps / 2} ${y} ${x} ${y}` : `M${x} ${y}`)).join(" ")
    : points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return `${line} L${W} ${H} L0 ${H}Z`;
}

/** A vertical gradient filling the canvas. */
export const sky = (id: string, top: string, bottom: string) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);

/** A soft radial glow. */
export const glow = (id: string, cx: number, cy: number, r: number, colour: string, opacity = 0.8) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={colour} stopOpacity={opacity} />
        <stop offset="1" stopColor={colour} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);
