import type { CSSProperties } from "react";
import { DAY_MINUTES, clock } from "../../lib/time";

/** Half-hour marks along the ruler. */
const MARKS = Array.from({ length: DAY_MINUTES / 30 }, (_, i) => i * 30);

type Props = {
  /** Minutes into the day on show right now, or null when it isn't today. */
  nowMinutes: number | null;
  clockText: string;
  onNow: () => void;
};

/**
 * The top of the grid: the time now and a button back to it in the corner,
 * then the day's half hours over five-minute ticks, with a pill marking
 * the current time.
 */
export function GuideRuler({ nowMinutes, clockText, onNow }: Props) {
  return (
    <div className="guide__ruler">
      <div className="guide__corner">
        <p className="guide__clock">
          <span className="guide__clock-label">Now</span>
          <span className="guide__clock-time">{clockText}</span>
        </p>
        <button type="button" className="guide__on-now" onClick={onNow}>
          On now
        </button>
      </div>
      <ol className="guide__marks" aria-hidden="true">
        {MARKS.map((m) => (
          <li key={m} className={m % 60 ? "guide__mark guide__mark--half" : "guide__mark"} style={{ "--at": m } as CSSProperties}>
            {clock(m)}
          </li>
        ))}
      </ol>
      {nowMinutes !== null && nowMinutes < DAY_MINUTES && (
        <p className="guide__now-flag" style={{ "--at": nowMinutes } as CSSProperties} aria-hidden="true">
          {clock(Math.floor(nowMinutes))}
        </p>
      )}
    </div>
  );
}
