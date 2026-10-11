/**
 * Block lettering in teletext mosaic graphics. Each character cell is split
 * into 2 × 3 "sixels"; these letters are 5 sixels wide and 7 tall, so a
 * word sits across three rows of text, as the big page banners did.
 */
const FONT: Record<string, readonly string[]> = {
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  G: [".####", "#....", "#....", "#..##", "#...#", "#...#", ".###."],
  N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
};

const HEIGHT = 9; // Three rows of text, three sixels each.

export function Mosaic({ text }: { text: string }) {
  const letters = [...text.toUpperCase()].filter((ch) => ch in FONT);
  const width = letters.length * 6 + 1;
  // One square per lit sixel, all in a single path.
  const d = letters
    .flatMap((ch, i) =>
      FONT[ch].flatMap((row, y) => [...row].map((px, x) => (px === "#" ? `M${1 + i * 6 + x} ${1 + y}h1v1h-1z` : ""))),
    )
    .join("");

  return (
    <svg
      className="tt-mosaic"
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{ width: `${width / 2}ch` }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
