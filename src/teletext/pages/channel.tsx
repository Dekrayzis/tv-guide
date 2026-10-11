import { CHANNELS } from "../../data/channels";
import { isOnAt } from "../../lib/time";
import { COLOURS, INDEX, LINES, TODAY, TOMORROW, chunk, tt, type Page, type Service } from "./shared";

/** 601–608 and 611–618: one channel's day, today or tomorrow, sixteen programmes to a subpage. */
export function channelPage(s: Service, i: number, when: "today" | "tomorrow"): Page {
  const channel = CHANNELS[i];
  const today = when === "today";
  const list = (today ? s.today : s.tomorrow).get(channel.id) ?? [];
  const live = today ? list.findIndex((p) => isOnAt(p, s.nowMinutes)) : -1;
  const base = today ? TODAY : TOMORROW;
  // The channels either side, wrapping round.
  const prev = (i + CHANNELS.length - 1) % CHANNELS.length;
  const next = (i + 1) % CHANNELS.length;

  return {
    title: channel.name,
    colour: COLOURS[channel.id],
    aside: today ? "Today" : "Tomorrow",
    startAt: live >= 0 ? Math.floor(live / LINES) : 0,
    info: today ? `Tomorrow's listings: ${TOMORROW + i}` : `Today's listings: ${TODAY + i}`,
    subpages: chunk(list, LINES).map((part, n) => (
      <ol key={n} className="tt-listing">
        {part.map((p, row) => {
          const isLive = n * LINES + row === live;
          return (
            <li key={p.id} className={isLive ? "is-now" : undefined}>
              <span className="tt-listing__time">{tt(p.start)}</span>
              <span className="tt-listing__title">{p.title}</span>
              {isLive && <span className="sr-only">, on now</span>}
            </li>
          );
        })}
      </ol>
    )),
    fastext: [
      { label: CHANNELS[prev].name, page: base + prev },
      { label: CHANNELS[next].name, page: base + next },
      today ? { label: "Tomorrow", page: TOMORROW + i } : { label: "Today", page: TODAY + i },
      { label: "Index", page: INDEX },
    ],
  };
}
