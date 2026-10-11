import { memo, useId, type ReactNode } from "react";
import type { Genre } from "../data/types";
import { hash, seeded, type Rand } from "../lib/random";

/**
 * Artwork for a programme, drawn rather than photographed: a small scene
 * for its genre (a skyline for the news, mountains for a documentary, a
 * stadium for sport...), varied by the show's title so each show keeps
 * its own picture all week, and tinted with the channel's colour.
 */

const W = 240;
const H = 80;

type Paint = { rand: Rand; tint: string; id: (name: string) => string };

const between = (rand: Rand, lo: number, hi: number) => lo + rand() * (hi - lo);

/** A jagged or rolling skyline across the full width, as a closed path. */
function ridge(rand: Rand, base: number, height: number, steps: number, smooth: boolean) {
  const points = Array.from({ length: steps + 1 }, (_, i) => [(i / steps) * W, base - rand() * height] as const);
  const line = smooth
    ? points.map(([x, y], i) => (i ? `S${x - W / steps / 2} ${y} ${x} ${y}` : `M${x} ${y}`)).join(" ")
    : points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return `${line} L${W} ${H} L0 ${H}Z`;
}

const sky = (id: string, top: string, bottom: string) => (
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

const glow = (id: string, cx: number, cy: number, r: number, colour: string, opacity = 0.8) => (
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

const SCENES: Record<Genre, (p: Paint) => ReactNode> = {
  // A city at night, windows lit.
  news: ({ rand, tint, id }) => {
    const buildings: ReactNode[] = [];
    for (let x = 0; x < W; ) {
      const w = between(rand, 10, 24);
      const h = between(rand, 18, 62);
      buildings.push(<rect key={`b${x}`} x={x} y={H - h} width={w - 1.5} height={h} fill="#0a0f22" />);
      for (let wy = H - h + 4; wy < H - 4; wy += 5)
        for (let wx = x + 2; wx < x + w - 4; wx += 4)
          if (rand() < 0.3) buildings.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width="1.6" height="2" fill="#ffd98a" opacity="0.7" />);
      x += w;
    }
    return (
      <>
        {sky(id("sky"), "#060a1c", "#1d2a5c")}
        {glow(id("glow"), W * 0.6, H, 90, tint, 0.55)}
        {buildings}
      </>
    );
  },

  // A moonlit night over the hills, one window lit.
  drama: ({ rand, tint, id }) => {
    const moonX = between(rand, 140, 220);
    const houseX = between(rand, 110, 200);
    return (
      <>
        {sky(id("sky"), "#0c0a24", "#3a1f4d")}
        {glow(id("moon"), moonX, 22, 30, "#f6e7c1", 0.45)}
        <circle cx={moonX} cy="22" r="9" fill="#f6e7c1" />
        <path d={ridge(rand, 58, 16, 6, true)} fill="#1c1436" />
        <path d={ridge(rand, 70, 10, 5, true)} fill="#0b0918" />
        <path d={`M${houseX} 62 h18 v-12 l-9 -8 l-9 8z`} fill="#0b0918" />
        <rect x={houseX + 6} y="54" width="4" height="4" fill={tint} />
      </>
    );
  },

  // Stage spotlights.
  entertainment: ({ rand, tint, id }) => (
    <>
      {sky(id("sky"), "#090616", "#1c0f33")}
      {glow(id("floor"), W * 0.6, H + 10, 80, tint, 0.7)}
      <defs>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 4 }, (_, i) => {
        const x = 70 + i * 45 + between(rand, -10, 10);
        const spread = between(rand, 14, 26);
        const lean = between(rand, -30, 30);
        return <path key={i} d={`M${x - 2} 0 L${x + 2} 0 L${x + lean + spread} ${H} L${x + lean - spread} ${H}Z`} fill={`url(#${id("beam")})`} />;
      })}
    </>
  ),

  // Confetti.
  comedy: ({ rand, tint, id }) => (
    <>
      {sky(id("sky"), "#2a0f3d", "#5b1a4a")}
      {glow(id("glow"), W * 0.7, H * 0.5, 70, tint, 0.6)}
      {Array.from({ length: 40 }, (_, i) => {
        const colours = ["#ffd23f", "#ff5d8f", "#3ee6c4", "#ffffff", tint];
        const x = between(rand, 60, W);
        const y = between(rand, 0, H);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={between(rand, 2, 5)}
            height={between(rand, 1.5, 3)}
            fill={colours[i % colours.length]}
            transform={`rotate(${between(rand, 0, 180)} ${x} ${y})`}
            opacity="0.85"
          />
        );
      })}
    </>
  ),

  // Mountains in layers, and the sun.
  documentary: ({ rand, tint, id }) => {
    const sunX = between(rand, 130, 210);
    return (
      <>
        {sky(id("sky"), "#0d2a3a", "#4f8a8b")}
        {glow(id("sun"), sunX, 30, 40, "#ffe8a3", 0.6)}
        <circle cx={sunX} cy="30" r="8" fill="#ffe8a3" opacity="0.9" />
        <path d={ridge(rand, 50, 26, 7, false)} fill="#2c5a64" />
        <path d={ridge(rand, 62, 20, 9, false)} fill="#1a3a44" />
        <path d={ridge(rand, 74, 10, 6, true)} fill={tint} opacity="0.35" />
        <path d={ridge(rand, 78, 6, 6, true)} fill="#0b1e26" />
      </>
    );
  },

  // A widescreen sunset, letterboxed.
  film: ({ rand, tint, id }) => {
    const sunX = between(rand, 120, 200);
    return (
      <>
        {sky(id("sky"), "#22103f", "#e0663c")}
        {glow(id("sun"), sunX, 60, 50, "#ffb36b", 0.8)}
        <circle cx={sunX} cy="60" r="16" fill="#ffd08a" />
        <path d={ridge(rand, 62, 14, 8, false)} fill="#1a0c22" />
        <rect width={W} height="7" fill="#000" />
        <rect y={H - 7} width={W} height="7" fill="#000" />
        <rect y={H - 9} width={W} height="2" fill={tint} opacity="0.5" />
      </>
    );
  },

  // A floodlit pitch.
  sport: ({ rand, tint, id }) => (
    <>
      {sky(id("sky"), "#050b14", "#0f2a1a")}
      {glow(id("light1"), between(rand, 90, 130), 6, 40, "#eaffd8", 0.5)}
      {glow(id("light2"), between(rand, 180, 230), 6, 40, "#eaffd8", 0.5)}
      <rect y="30" width={W} height="6" fill="#1b2433" />
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={between(rand, 0, W)} cy={between(rand, 30, 36)} r="0.8" fill={rand() < 0.3 ? tint : "#9aa7bd"} opacity="0.7" />
      ))}
      <path d={`M-40 ${H} L60 36 L${W - 20} 36 L${W + 60} ${H}Z`} fill="#1f7a3a" />
      <g fill="none" stroke="#e8ffe8" strokeOpacity="0.45" strokeWidth="1">
        <path d={`M${W * 0.45} 36 L${W * 0.5} ${H}`} />
        <ellipse cx={W * 0.48} cy="56" rx="22" ry="7" />
      </g>
    </>
  ),

  // Rounded hills, stars and a cloud.
  kids: ({ rand, tint, id }) => (
    <>
      {sky(id("sky"), "#3b2a8f", "#ff8fc7")}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={between(rand, 70, W)} cy={between(rand, 4, 34)} r={between(rand, 0.8, 1.8)} fill="#fff" />
      ))}
      <g fill="#fff" opacity="0.9">
        {(() => {
          const x = between(rand, 120, 200);
          return (
            <>
              <circle cx={x} cy="26" r="7" />
              <circle cx={x + 9} cy="22" r="9" />
              <circle cx={x + 19} cy="27" r="6" />
              <rect x={x} y="26" width="20" height="7" rx="3" />
            </>
          );
        })()}
      </g>
      <ellipse cx={between(rand, 80, 140)} cy="86" rx="70" ry="30" fill="#58d68d" />
      <ellipse cx={between(rand, 170, 230)} cy="90" rx="70" ry="28" fill={tint} />
    </>
  ),

  // A cosy house at dusk.
  lifestyle: ({ rand, tint, id }) => {
    const x = between(rand, 120, 190);
    return (
      <>
        {sky(id("sky"), "#3d2a5c", "#f2a65a")}
        {glow(id("sun"), x - 30, 50, 40, "#ffe0a8", 0.6)}
        <path d={ridge(rand, 66, 8, 5, true)} fill="#3a5a40" />
        <path d={`M${x} 68 v-16 l14 -11 l14 11 v16z`} fill="#2a1f2e" />
        <rect x={x + 5} y="55" width="6" height="6" fill="#ffd98a" />
        <rect x={x + 17} y="55" width="6" height="6" fill={tint} />
        <rect y="68" width={W} height="12" fill="#2b4430" />
      </>
    );
  },

  // An equaliser, glowing.
  music: ({ rand, tint, id }) => (
    <>
      {sky(id("sky"), "#0a0418", "#25093a")}
      {glow(id("glow"), W * 0.65, H * 0.6, 80, tint, 0.55)}
      <defs>
        <linearGradient id={id("bar")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#ff5ad1" />
        </linearGradient>
      </defs>
      {Array.from({ length: 26 }, (_, i) => {
        const h = between(rand, 6, 58);
        return <rect key={i} x={80 + i * 6} y={H - 6 - h} width="4" height={h} rx="1" fill={`url(#${id("bar")})`} opacity="0.9" />;
      })}
    </>
  ),

  // A neon grid running to the horizon, under a striped sun.
  gaming: ({ rand, tint, id }) => {
    const sunX = between(rand, 140, 200);
    return (
      <>
        {sky(id("sky"), "#12002b", "#7a1d6e")}
        <circle cx={sunX} cy="40" r="16" fill="#ffb347" />
        {[30, 36, 42, 48].map((y, i) => (
          <rect key={y} x={sunX - 17} y={y} width="34" height={1 + i * 0.6} fill="#5a0e57" />
        ))}
        <rect y="48" width={W} height="32" fill="#14002a" />
        <g stroke={tint} strokeOpacity="0.8" strokeWidth="0.8">
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`v${i}`} x1={sunX} y1="48" x2={sunX + (i - 7) * 40} y2={H} />
          ))}
          {[50, 53, 57, 63, 71].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2={W} y2={y} />
          ))}
        </g>
      </>
    );
  },
};

type Props = {
  title: string;
  genre: Genre;
  tint: string;
  /** Which part of the scene to keep when it's cropped: the right (in the grid) or the middle. */
  focus?: "right" | "middle";
};

export const ProgrammeArt = memo(function ProgrammeArt({ title, genre, tint, focus = "right" }: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}${name}`;
  return (
    <svg className="art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio={focus === "right" ? "xMaxYMid slice" : "xMidYMid slice"} aria-hidden="true">
      {SCENES[genre]({ rand: seeded(hash(title)), tint, id })}
    </svg>
  );
});
