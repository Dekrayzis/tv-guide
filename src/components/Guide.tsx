import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from "react";
import type { Channel, Genre, Programme } from "../data/types";
import { DAY_MINUTES, clock, minutesFromStart } from "../lib/time";

/** Where a day that isn't today opens: at the start of prime time. */
const PRIME_TIME = minutesFromStart("19:00");
/** Half-hour marks along the ruler. */
const MARKS = Array.from({ length: DAY_MINUTES / 30 }, (_, i) => i * 30);

const fullDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

export type GuideHandle = { scrollToNow: () => void };

type Props = {
  ref?: Ref<GuideHandle>;
  day: Date;
  channels: readonly Channel[];
  listings: ReadonlyMap<string, Programme[]>;
  /** Minutes into this day right now, or null when the day on show isn't today. */
  nowMinutes: number | null;
  genres: ReadonlySet<Genre>;
  onOpen: (programme: Programme) => void;
};

type Position = { row: number; index: number };

/** The programme on at `minute` in a channel's listings (or the last one, if it's past them all). */
const indexAt = (programmes: Programme[], minute: number) => {
  const i = programmes.findIndex((p) => p.end > minute);
  return i === -1 ? programmes.length - 1 : i;
};

/**
 * The grid: channels down the side, the day across the top, programmes
 * sized to their length. It's an ARIA grid with one tab stop: the arrow
 * keys move between programmes (up and down keep to the same time),
 * Home and End go to either end of a channel's day, and Enter opens one.
 */
export function Guide({ ref, day, channels, listings, nowMinutes, genres, onOpen }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<string, HTMLButtonElement>());
  const rows = channels.map((c) => listings.get(c.id) ?? []);
  const startAt = nowMinutes ?? PRIME_TIME;

  const [focus, setFocus] = useState<Position>(() => ({ row: 0, index: indexAt(rows[0], startAt) }));
  // The time the arrow keys keep to when moving between channels.
  const anchor = useRef(rows[0][focus.index]?.start ?? 0);
  const moved = useRef(false);

  const scrollToMinute = (minute: number, behavior: ScrollBehavior) => {
    const el = scroller.current;
    if (!el) return;
    const style = getComputedStyle(el);
    const perMinute = parseFloat(style.getPropertyValue("--ppm"));
    const channelWidth = parseFloat(style.getPropertyValue("--channel-w")) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Leave a little of what's just finished in view, to the left of the time.
    const lead = (el.clientWidth - channelWidth) * 0.15;
    el.scrollTo({ left: Math.max(0, minute * perMinute - lead), behavior });
  };

  useImperativeHandle(ref, () => ({
    scrollToNow: () => {
      if (nowMinutes === null) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollToMinute(nowMinutes, reduce ? "auto" : "smooth");
      setFocus((f) => ({ row: f.row, index: indexAt(rows[f.row], nowMinutes) }));
      anchor.current = nowMinutes;
    },
  }));

  // A new day opens at the current time, or at prime time.
  useEffect(() => scrollToMinute(startAt, "auto"), []);

  // After a key moves the focus, follow it.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const cell = cells.current.get(`${focus.row}:${focus.index}`);
    cell?.focus({ preventScroll: true });
    cell?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [focus]);

  const move = (next: Position) => {
    moved.current = true;
    setFocus(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const { row, index } = focus;
    const last = rows[row].length - 1;
    let next: Position | null = null;
    switch (event.key) {
      case "ArrowRight":
        next = { row, index: Math.min(last, index + 1) };
        break;
      case "ArrowLeft":
        next = { row, index: Math.max(0, index - 1) };
        break;
      case "Home":
        next = { row: event.ctrlKey ? 0 : row, index: 0 };
        break;
      case "End":
        next = { row: event.ctrlKey ? rows.length - 1 : row, index: event.ctrlKey ? rows.at(-1)!.length - 1 : last };
        break;
      case "ArrowDown":
      case "ArrowUp": {
        const r = Math.min(rows.length - 1, Math.max(0, row + (event.key === "ArrowDown" ? 1 : -1)));
        move({ row: r, index: indexAt(rows[r], anchor.current) });
        event.preventDefault();
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    anchor.current = rows[next.row][next.index].start;
    move(next);
  };

  const label = `Listings for ${fullDate.format(day)}`;

  return (
    <div
      ref={scroller}
      className="guide"
      role="grid"
      aria-label={label}
      aria-rowcount={channels.length}
      onKeyDown={onKeyDown}
    >
      <div className="guide__ruler" aria-hidden="true">
        <div className="guide__corner" />
        <ol className="guide__marks">
          {MARKS.map((m) => (
            <li key={m} className={m % 60 ? "guide__mark guide__mark--half" : "guide__mark"} style={{ "--at": m } as CSSProperties}>
              {clock(m)}
            </li>
          ))}
        </ol>
        {nowMinutes !== null && nowMinutes < DAY_MINUTES && (
          <p className="guide__now-flag" style={{ "--at": nowMinutes } as CSSProperties}>
            Now
          </p>
        )}
      </div>

      <div className="guide__body">
        {channels.map((channel, row) => (
          <div
            key={channel.id}
            role="row"
            aria-rowindex={row + 1}
            className="guide__row"
            style={{ "--channel": channel.colour } as CSSProperties}
          >
            <div role="rowheader" className="channel">
              <span className="channel__mark" aria-hidden="true">
                {channel.mark}
              </span>
              <span className="channel__text">
                <span className="channel__name">{channel.name}</span>
                <span className="channel__number">
                  <span className="sr-only">, channel </span>
                  {channel.number}
                </span>
              </span>
            </div>

            <div role="none" className="guide__track">
              {rows[row].map((p, index) => {
                const live = nowMinutes !== null && p.start <= nowMinutes && nowMinutes < p.end;
                const past = nowMinutes !== null && p.end <= nowMinutes;
                const dimmed = genres.size > 0 && !genres.has(p.genre);
                const length = p.end - p.start;
                const classes = [
                  "slot",
                  live && "is-live",
                  past && "is-past",
                  dimmed && "is-dimmed",
                  length < 20 && "is-narrow",
                ].filter(Boolean).join(" ");
                const style = {
                  "--start": p.start,
                  "--length": length,
                  "--progress": live ? (nowMinutes! - p.start) / length : undefined,
                } as CSSProperties;
                return (
                  <div key={p.id} role="gridcell" className={classes} style={style}>
                    <button
                      ref={(el) => {
                        if (el) cells.current.set(`${row}:${index}`, el);
                        else cells.current.delete(`${row}:${index}`);
                      }}
                      type="button"
                      className="slot__button"
                      tabIndex={focus.row === row && focus.index === index ? 0 : -1}
                      onFocus={() => {
                        if (focus.row !== row || focus.index !== index) {
                          setFocus({ row, index });
                          anchor.current = p.start;
                        }
                      }}
                      onClick={() => onOpen(p)}
                    >
                      <span className="slot__label">
                        <span className="slot__title">{p.title}</span>
                        <span className="slot__time">
                          {clock(p.start)}
                          <span className="sr-only"> to {clock(p.end)}</span>
                          {live && <span className="sr-only">, on now</span>}
                          {p.isNew && (
                            <span className="slot__new">
                              <span className="sr-only">, </span>New
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {nowMinutes !== null && nowMinutes < DAY_MINUTES && (
          <div className="guide__now" style={{ "--at": nowMinutes } as CSSProperties} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
