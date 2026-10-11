import { CHANNELS } from "../../data/channels";
import type { Programme } from "../../data/types";
import { isOnAt } from "../../lib/time";
import { COLOURS, INDEX, QUIZ, TODAY, TOMORROW, chunk, tt, type Page, type Service } from "./shared";

/** Channels to a subpage: four lines each (name, now, next and a gap) fill the sixteen rows. */
const PER_SUBPAGE = 4;

/** 609: what's on every channel now, and what's on after. */
export function nowNextPage(s: Service): Page {
  const rows = CHANNELS.map((channel) => {
    const list = s.today.get(channel.id) ?? [];
    const i = list.findIndex((p) => isOnAt(p, s.nowMinutes));
    // The last programme of the night is followed by tomorrow's first.
    const next = list[i + 1] ?? s.tomorrow.get(channel.id)?.[0];
    return { channel, now: list[i], next };
  });

  const line = (label: string, p: Programme | undefined) =>
    p && (
      <p className="tt-nownext__line">
        <span className="tt-nownext__label">{label}</span>
        <span className="tt-nownext__time">{tt(p.start)}</span> {p.title}
      </p>
    );

  return {
    title: "Now and next",
    colour: "green",
    info: "Full listings: 601-608",
    subpages: chunk(rows, PER_SUBPAGE).map((part, n) => (
      <ul key={n} className="tt-nownext">
        {part.map(({ channel, now, next }) => (
          <li key={channel.id}>
            <h3 className={`tt-nownext__channel tt-${COLOURS[channel.id]}`}>{channel.name}</h3>
            {line("Now", now)}
            {line("Next", next)}
          </li>
        ))}
      </ul>
    )),
    fastext: [
      { label: CHANNELS[0].name, page: TODAY },
      { label: "Tomorrow", page: TOMORROW },
      { label: "TV Quiz", page: QUIZ },
      { label: "Index", page: INDEX },
    ],
  };
}
