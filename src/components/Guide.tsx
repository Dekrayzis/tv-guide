import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from "react";
import type { Channel, Programme } from "../data/types";
import { DAY_MINUTES, clock, minutesFromStart } from "../lib/time";
import { ChannelLogo } from "./ChannelLogo";
import { ProgrammeArt } from "./ProgrammeArt";

/** Where a day that isn't today opens: at the start of prime time. */
const PRIME_TIME = minutesFromStart("19:00");
/** Half-hour marks along the ruler. */
const MARKS = Array.from({ length: DAY_MINUTES / 30 }, (_, i) => i * 30);
/** The column before the programmes: a channel's favourite star. */
const STAR = -1;

const fullDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

export type GuideHandle = {
  scrollToNow: () => void;
  /** Scroll to and focus the first programme that matches, from now on if it's today. Returns whether one did. */
  reveal: (matches: (p: Programme) => boolean) => boolean;
};

type Props = {
  ref?: Ref<GuideHandle>;
  day: Date;
  channels: readonly Channel[];
  listings: ReadonlyMap<string, Programme[]>;
  /** Minutes into this day right now, or null when the day on show isn't today. */
  nowMinutes: number | null;
  /** The time for the clock in the corner. */
  clockText: string;
  onNow: () => void;
  /** Whether a programme passes the genre filter and the search; the rest are dimmed. */
  matches: (p: Programme) => boolean;
  favourites: ReadonlySet<string>;
  onFavourite: (channelId: string) => void;
  onOpen: (programme: Programme) => void;
};

type Position = { row: number; index: number };

/** The programme on at `minute` in a channel's listings (or the last one, if it's past them all). */
const indexAt = (programmes: Programme[], minute: number) => {
  const i = programmes.findIndex((p) => p.end > minute);
  return i === -1 ? programmes.length - 1 : i;
};

const isLiveEvent = (p: Programme) => p.title.startsWith("Live:");

/**
 * The grid: channels down the side, the day across the top, programmes
 * sized to their length. It's an ARIA grid with one tab stop: the arrow
 * keys move between programmes (up and down keep to the same time, and
 * left from the first programme reaches the channel's favourite star),
 * Home and End go to either end of a channel's day, and Enter opens one.
 */
export function Guide({ ref, day, channels, listings, nowMinutes, clockText, onNow, matches, favourites, onFavourite, onOpen }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<string, HTMLElement>());
  const rows = channels.map((c) => listings.get(c.id) ?? []);
  const startAt = nowMinutes ?? PRIME_TIME;

  const [focus, setFocus] = useState<Position>(() => ({ row: 0, index: indexAt(rows[0], startAt) }));
  // The time the arrow keys keep to when moving between channels.
  const anchor = useRef(rows[0][focus.index]?.start ?? 0);
  const moved = useRef(false);

  const metrics = () => {
    const el = scroller.current!;
    const style = getComputedStyle(el);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { el, perMinute: parseFloat(style.getPropertyValue("--ppm")), channelWidth: parseFloat(style.getPropertyValue("--channel-w")) * rem };
  };

  const scrollToMinute = (minute: number, behavior: ScrollBehavior) => {
    if (!scroller.current) return;
    const { el, perMinute, channelWidth } = metrics();
    // Leave a little of what's just finished in view, to the left of the time.
    const lead = (el.clientWidth - channelWidth) * 0.15;
    el.scrollTo({ left: Math.max(0, minute * perMinute - lead), behavior });
  };

  const smooth = (): ScrollBehavior => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  const move = (next: Position) => {
    moved.current = true;
    setFocus(next);
  };

  useImperativeHandle(ref, () => ({
    scrollToNow: () => {
      if (nowMinutes === null) return;
      scrollToMinute(nowMinutes, smooth());
      setFocus((f) => ({ row: f.row, index: indexAt(rows[f.row], nowMinutes) }));
      anchor.current = nowMinutes;
    },
    reveal: (test) => {
      const from = nowMinutes ?? 0;
      // The earliest match still to finish, across every channel.
      let best: (Position & { start: number }) | null = null;
      rows.forEach((list, row) =>
        list.forEach((p, index) => {
          if (p.end > from && test(p) && (!best || p.start < best.start)) best = { row, index, start: p.start };
        }),
      );
      if (!best) return false;
      const { row, index, start } = best;
      anchor.current = start;
      move({ row, index });
      return true;
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
    if (focus.index !== STAR) cell?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: smooth() });
  }, [focus]);

  const onKeyDown = (event: KeyboardEvent) => {
    const { row, index } = focus;
    const last = rows[row].length - 1;
    let next: Position | null = null;
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
        next = { row: event.ctrlKey ? rows.length - 1 : row, index: event.ctrlKey ? rows.at(-1)!.length - 1 : last };
        break;
      case "ArrowDown":
      case "ArrowUp": {
        const r = Math.min(rows.length - 1, Math.max(0, row + (event.key === "ArrowDown" ? 1 : -1)));
        move({ row: r, index: index === STAR ? STAR : indexAt(rows[r], anchor.current) });
        event.preventDefault();
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    if (next.index !== STAR) anchor.current = rows[next.row][next.index].start;
    move(next);
  };

  const register = (key: string) => (el: HTMLElement | null) => {
    if (el) cells.current.set(key, el);
    else cells.current.delete(key);
  };

  const tabStop = (row: number, index: number) => (focus.row === row && focus.index === index ? 0 : -1);
  const showNow = nowMinutes !== null && nowMinutes < DAY_MINUTES;

  return (
    <div ref={scroller} className="guide" role="grid" aria-label={`Listings for ${fullDate.format(day)}`} aria-rowcount={channels.length} onKeyDown={onKeyDown}>
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
        {showNow && (
          <p className="guide__now-flag" style={{ "--at": nowMinutes } as CSSProperties} aria-hidden="true">
            {clock(Math.floor(nowMinutes))}
          </p>
        )}
      </div>

      <div className="guide__body">
        {channels.map((channel, row) => {
          const favourite = favourites.has(channel.id);
          return (
            <div key={channel.id} role="row" aria-rowindex={row + 1} className="guide__row" style={{ "--channel": channel.colour } as CSSProperties}>
              <div role="rowheader" className="channel">
                <span className="channel__number">{channel.number}</span>
                <ChannelLogo id={channel.id} className="channel__logo" />
                <span className="channel__text">
                  <span className="channel__name">{channel.name}</span>
                  <span className="channel__category">
                    <span className="sr-only">, </span>
                    {channel.category}
                  </span>
                </span>
                <button
                  ref={register(`${row}:${STAR}`)}
                  type="button"
                  className="channel__star"
                  aria-pressed={favourite}
                  aria-label={`Favourite ${channel.name}`}
                  tabIndex={tabStop(row, STAR)}
                  onFocus={() => (focus.row !== row || focus.index !== STAR) && setFocus({ row, index: STAR })}
                  onClick={() => onFavourite(channel.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
                  </svg>
                </button>
              </div>

              <div role="none" className="guide__track">
                {rows[row].map((p, index) => {
                  const live = nowMinutes !== null && p.start <= nowMinutes && nowMinutes < p.end;
                  const past = nowMinutes !== null && p.end <= nowMinutes;
                  const length = p.end - p.start;
                  const classes = [
                    "slot",
                    live && "is-live",
                    past && "is-past",
                    !matches(p) && "is-dimmed",
                    length < 20 && "is-narrow",
                    length < 45 && "is-compact",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const style = {
                    "--start": p.start,
                    "--length": length,
                    "--progress": live ? (nowMinutes! - p.start) / length : undefined,
                  } as CSSProperties;
                  return (
                    <div key={p.id} role="gridcell" className={classes} style={style}>
                      <button
                        ref={register(`${row}:${index}`)}
                        type="button"
                        className="slot__button"
                        tabIndex={tabStop(row, index)}
                        onFocus={() => {
                          if (focus.row !== row || focus.index !== index) {
                            setFocus({ row, index });
                            anchor.current = p.start;
                          }
                        }}
                        onClick={() => onOpen(p)}
                      >
                        <ProgrammeArt title={p.title} genre={p.genre} tint={channel.colour} />
                        <span className="slot__label">
                          <span className="slot__head">
                            <span className="slot__title">{p.title}</span>
                            {(live || p.isNew) && (
                              <span className={`slot__badge${live ? (isLiveEvent(p) ? " slot__badge--live" : " slot__badge--now") : ""}`}>
                                <span className="sr-only">, </span>
                                {live ? (isLiveEvent(p) ? "Live" : "On now") : "New"}
                              </span>
                            )}
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
                })}
              </div>
            </div>
          );
        })}

        {showNow && <div className="guide__now" style={{ "--at": nowMinutes } as CSSProperties} aria-hidden="true" />}
      </div>
    </div>
  );
}
