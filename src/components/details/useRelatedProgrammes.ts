import { useMemo } from "react";
import { channelListings, listingsFor } from "../../data/schedule";
import type { Programme } from "../../data/types";

/** How many of each to show. */
const NEXT = 3;
const OTHERS = 4;

/**
 * What else to offer from a programme's details: the next few programmes on
 * its channel, and other showings of the same show this week that haven't
 * finished (leaving out any already listed as next).
 */
export function useRelatedProgrammes(programme: Programme | null, dayKeys: readonly string[], nowMinutes: number) {
  return useMemo(() => {
    if (!programme) return { next: [], others: [] };
    const next = channelListings(programme.dayKey, programme.channelId)
      .filter((p) => p.start >= programme.end)
      .slice(0, NEXT);
    const listed = new Set([programme.id, ...next.map((p) => p.id)]);
    const others = dayKeys
      .flatMap((key) => [...listingsFor(key).values()].flat())
      .filter((p) => p.title === programme.title && !listed.has(p.id))
      .filter((p) => p.dayKey !== dayKeys[0] || p.end > nowMinutes)
      .slice(0, OTHERS);
    return { next, others };
  }, [programme, dayKeys]);
}
