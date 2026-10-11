import type { Programme } from "../data/types";

export type BadgeKind = "live" | "now" | "new";

const LABELS: Record<BadgeKind, string> = { live: "Live", now: "On now", new: "New" };

/** What a programme that's on says: LIVE for a live broadcast, ON NOW for anything else. */
export const onNowBadge = (p: Programme): BadgeKind => (p.isLive ? "live" : "now");

/** A small label on a programme. Screen readers hear it after a pause, as part of the programme's name. */
export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`badge badge--${kind}`}>
      <span className="sr-only">, </span>
      {LABELS[kind]}
    </span>
  );
}
