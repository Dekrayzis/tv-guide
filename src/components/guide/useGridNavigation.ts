import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Programme } from "../../data/types";
import { scrollBehaviour } from "../../lib/motion";

/** The column before the programmes: a channel's favourite star. */
export const STAR = -1;

export type Position = { row: number; index: number };

/** How a cell is found when focus moves to it: `data-cell="row:index"`. */
export const cellKey = (row: number, index: number) => `${row}:${index}`;

/** The programme on at `minute` in a channel's listings (or the last one, if it's past them all). */
export const indexAt = (programmes: readonly Programme[], minute: number) => {
  const i = programmes.findIndex((p) => p.end > minute);
  return i === -1 ? programmes.length - 1 : i;
};

/**
 * Roving focus for the guide's grid: one tab stop, moved by the keys.
 * Left and right step through a channel's programmes (left from the first
 * reaches its favourite star); up and down change channel and keep to the
 * same time; Home and End go to either end of the day, or with Ctrl, of the
 * whole grid.
 */
export function useGridNavigation(grid: RefObject<HTMLElement | null>, rows: readonly (readonly Programme[])[], startAt: number) {
  const [focus, setFocus] = useState<Position>(() => ({ row: 0, index: indexAt(rows[0], startAt) }));
  // The time up and down keep to.
  const anchor = useRef(rows[0][focus.index]?.start ?? 0);
  const moved = useRef(false);

  // After the focus is moved, follow it.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const cell = grid.current?.querySelector<HTMLElement>(`[data-cell="${cellKey(focus.row, focus.index)}"]`);
    cell?.focus({ preventScroll: true });
    if (focus.index !== STAR) cell?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: scrollBehaviour() });
  }, [focus]);

  /** Move focus to a cell. Pass `minute` to make that the time up and down keep to. */
  const moveTo = (next: Position, minute?: number) => {
    if (minute !== undefined) anchor.current = minute;
    moved.current = true;
    setFocus(next);
  };

  const startOf = ({ row, index }: Position) => (index === STAR ? undefined : rows[row][index].start);

  const onKeyDown = (event: KeyboardEvent) => {
    const { row, index } = focus;
    const last = rows[row].length - 1;
    let next: Position;
    switch (event.key) {
      case "ArrowRight":
        next = { row, index: Math.min(last, index + 1) };
        break;
      case "ArrowLeft":
        next = { row, index: Math.max(STAR, index - 1) };
        break;
      case "Home":
        next = { row: event.ctrlKey ? 0 : row, index: 0 };
        break;
      case "End":
        next = event.ctrlKey ? { row: rows.length - 1, index: rows.at(-1)!.length - 1 } : { row, index: last };
        break;
      case "ArrowDown":
      case "ArrowUp": {
        const r = Math.min(rows.length - 1, Math.max(0, row + (event.key === "ArrowDown" ? 1 : -1)));
        event.preventDefault();
        moveTo({ row: r, index: index === STAR ? STAR : indexAt(rows[r], anchor.current) });
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    moveTo(next, startOf(next));
  };

  /** A cell got focus some other way (a click, or Tab): it becomes the tab stop. */
  const focused = (row: number, index: number) => {
    if (focus.row === row && focus.index === index) return;
    setFocus({ row, index });
    const start = startOf({ row, index });
    if (start !== undefined) anchor.current = start;
  };

  /** Put the tab stop on the programme on at `minute`, in the same channel, without moving focus. */
  const settleAt = (minute: number) => {
    setFocus((f) => ({ row: f.row, index: indexAt(rows[f.row], minute) }));
    anchor.current = minute;
  };

  const isTabStop = (row: number, index: number) => focus.row === row && focus.index === index;

  return { onKeyDown, moveTo, focused, settleAt, isTabStop };
}
