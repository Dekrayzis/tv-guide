import type { CSSProperties } from "react";
import type { Programme } from "../../data/types";
import { clock, isOnAt } from "../../lib/time";
import { Badge, onNowBadge, type BadgeKind } from "../Badge";
import { ProgrammeArt } from "../art/ProgrammeArt";
import { cellKey } from "./useGridNavigation";

/** Below these lengths (in minutes) a cell drops its time, then its extras. */
const NARROW = 20;
const COMPACT = 45;

type Props = {
  programme: Programme;
  tint: string;
  row: number;
  index: number;
  /** Minutes into the day on show right now, or null when it isn't today. */
  nowMinutes: number | null;
  /** Whether it passes the filters; if not, it's dimmed. */
  matches: boolean;
  tabStop: boolean;
  onFocus: () => void;
  onOpen: (programme: Programme) => void;
};

/**
 * One programme in the grid: placed by its start and sized by its length,
 * with its artwork, title, time, series tag and badge.
 */
export function ProgrammeCell({ programme: p, tint, row, index, nowMinutes, matches, tabStop, onFocus, onOpen }: Props) {
  const length = p.end - p.start;
  const live = nowMinutes !== null && isOnAt(p, nowMinutes);
  const past = nowMinutes !== null && p.end <= nowMinutes;
  const badge: BadgeKind | null = live ? onNowBadge(p) : p.isNew ? "new" : null;

  const classes = [
    "slot",
    live && "is-live",
    past && "is-past",
    !matches && "is-dimmed",
    length < NARROW && "is-narrow",
    length < COMPACT && "is-compact",
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    "--start": p.start,
    "--length": length,
    "--progress": live ? (nowMinutes! - p.start) / length : undefined,
  } as CSSProperties;

  return (
    <div role="gridcell" className={classes} style={style}>
      <button
        type="button"
        className="slot__button"
        data-cell={cellKey(row, index)}
        tabIndex={tabStop ? 0 : -1}
        onFocus={onFocus}
        onClick={() => onOpen(p)}
      >
        <ProgrammeArt title={p.title} genre={p.genre} tint={tint} />
        <span className="slot__label">
          <span className="slot__head">
            <span className="slot__title">{p.title}</span>
            {badge && <Badge kind={badge} />}
          </span>
          <span className="slot__time">
            {clock(p.start)} – {clock(p.end)}
          </span>
          {p.seriesTag && (
            <span className="slot__tag">
              <span className="sr-only">, </span>
              {p.seriesTag}
              {p.episode && <span className="slot__episode"> {p.episode}</span>}
            </span>
          )}
        </span>
        <svg className="slot__chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
