/**
 * A seeded random generator (mulberry32), so a day's listings come out the
 * same every time they're generated: on reload, and for every visitor.
 */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable number for a string (FNV-1a), to seed from a channel and a date. */
export function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Rand = ReturnType<typeof seeded>;

/** One item at random. */
export const pick = <T,>(rand: Rand, items: readonly T[]): T => items[Math.floor(rand() * items.length)];
