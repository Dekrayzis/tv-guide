import { useEffect, useImperativeHandle, useRef, type CSSProperties, type Ref } from "react";
import type { Listings } from "../../data/schedule";
import type { Channel, Programme } from "../../data/types";
import { longDate } from "../../lib/format";
import { scrollBehaviour } from "../../lib/motion";
import { DAY_MINUTES, PRIME_TIME } from "../../lib/time";
import { ChannelHeader } from "./ChannelHeader";
import { GuideRuler } from "./GuideRuler";
import { ProgrammeCell } from "./ProgrammeCell";
import { STAR, useGridNavigation, type Position } from "./useGridNavigation";

export type GuideHandle = {
  scrollToNow: () => void;
  /** Scroll to and focus the first programme that matches, from now on if it's today. Returns whether one did. */
  reveal: (matches: (p: Programme) => boolean) => boolean;
};

type Props = {
  ref?: Ref<GuideHandle>;
  day: Date;
  channels: readonly Channel[];
  listings: Listings;
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

/**
 * The grid: channels down the side, the day across the top, programmes
 * sized to their length. It's an ARIA grid with one tab stop (see
 * useGridNavigation for the keys); Enter or a click opens a programme.
 */
export function Guide({ ref, day, channels, listings, nowMinutes, clockText, onNow, matches, favourites, onFavourite, onOpen }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const rows = channels.map((c) => listings.get(c.id) ?? []);
  // A new day opens at the current time, or at prime time.
  const startAt = nowMinutes ?? PRIME_TIME.start;
  const nav = useGridNavigation(scroller, rows, startAt);

  const scrollToMinute = (minute: number, behavior: ScrollBehavior) => {
    const el = scroller.current;
    if (!el) return;
    const style = getComputedStyle(el);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const perMinute = parseFloat(style.getPropertyValue("--ppm"));
    const channelWidth = parseFloat(style.getPropertyValue("--channel-w")) * rem;
    // Leave a little of what's just finished in view, to the left of the time.
    const lead = (el.clientWidth - channelWidth) * 0.15;
    el.scrollTo({ left: Math.max(0, minute * perMinute - lead), behavior });
  };

  useImperativeHandle(ref, () => ({
    scrollToNow: () => {
      if (nowMinutes === null) return;
      scrollToMinute(nowMinutes, scrollBehaviour());
      nav.settleAt(nowMinutes);
    },
    reveal: (test) => {
      const from = nowMinutes ?? 0;
      // The earliest match still to finish, across every channel.
      let best: (Position & { start: number }) | undefined;
      rows.forEach((list, row) =>
        list.forEach((p, index) => {
          if (p.end > from && test(p) && (!best || p.start < best.start)) best = { row, index, start: p.start };
        }),
      );
      if (!best) return false;
      nav.moveTo({ row: best.row, index: best.index }, best.start);
      return true;
    },
  }));

  useEffect(() => scrollToMinute(startAt, "auto"), []);

  return (
    <div
      ref={scroller}
      className="guide"
      role="grid"
      aria-label={`Listings for ${longDate.format(day)}`}
      aria-rowcount={channels.length}
      onKeyDown={nav.onKeyDown}
    >
      <GuideRuler nowMinutes={nowMinutes} clockText={clockText} onNow={onNow} />

      <div className="guide__body">
        {channels.map((channel, row) => (
          <div key={channel.id} role="row" aria-rowindex={row + 1} className="guide__row" style={{ "--channel": channel.colour } as CSSProperties}>
            <ChannelHeader
              channel={channel}
              row={row}
              favourite={favourites.has(channel.id)}
              tabStop={nav.isTabStop(row, STAR)}
              onFocus={() => nav.focused(row, STAR)}
              onToggleFavourite={() => onFavourite(channel.id)}
            />
            <div role="none" className="guide__track">
              {rows[row].map((p, index) => (
                <ProgrammeCell
                  key={p.id}
                  programme={p}
                  tint={channel.colour}
                  row={row}
                  index={index}
                  nowMinutes={nowMinutes}
                  matches={matches(p)}
                  tabStop={nav.isTabStop(row, index)}
                  onFocus={() => nav.focused(row, index)}
                  onOpen={onOpen}
                />
              ))}
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
