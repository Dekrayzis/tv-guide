import type { ReactNode } from "react";
import type { Channel, Programme } from "../data/types";
import { hash, pick, seeded } from "../lib/random";
import { clock, minutesFromStart } from "../lib/time";

/**
 * The teletext service: every page, built from the same listings as the
 * guide. 600 is the index, 601–608 each channel today and 611–618 tomorrow,
 * 609 is now and next, and 690 is a quiz with the answers concealed.
 */

export type Colour = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";
export type Fastext = { label: string; page: number };

export type Page = {
  /** The page's name: double height under the banner, and announced on arrival. */
  title: string;
  colour: Colour;
  /** Beside the title, e.g. "Today". */
  aside?: string;
  /** Each subpage fills the 16 rows of the page body. */
  subpages: ReactNode[];
  /** The subpage to open at: the one with the programme on now. */
  startAt?: number;
  info: string;
  /** The red, green, yellow and blue keys. */
  fastext: readonly [Fastext, Fastext, Fastext, Fastext];
};

export type Service = {
  channels: readonly Channel[];
  today: ReadonlyMap<string, Programme[]>;
  tomorrow: ReadonlyMap<string, Programme[]>;
  todayKey: string;
  /** Minutes into today's broadcast day. */
  nowMinutes: number;
};

export const LINES = 16;
export const INDEX = 600;
export const TODAY = 601;
export const NOW_NEXT = 609;
export const TOMORROW = 611;
export const QUIZ = 690;

/** Each channel's colour, from the eight teletext could show (blue text is too dark to read on black). */
const COLOURS: Record<string, Colour> = {
  "signal-one": "red",
  northlight: "cyan",
  brightside: "yellow",
  atlas: "green",
  pitchside: "white",
  tumbletime: "magenta",
  rewind: "yellow",
  pulse: "cyan",
};

const PRIME = [minutesFromStart("19:00"), minutesFromStart("22:30")] as const;

/** Teletext times: "19.00". */
const tt = (minutes: number) => clock(minutes).replace(":", ".");

const chunk = <T,>(items: readonly T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

const onAt = (list: Programme[], minute: number) => list.findIndex((p) => p.start <= minute && minute < p.end);

/** Every page in service, in order: what the up and down keys step through. */
export const pagesInService = (channels: number) => [
  INDEX,
  ...Array.from({ length: channels }, (_, i) => TODAY + i),
  NOW_NEXT,
  ...Array.from({ length: channels }, (_, i) => TOMORROW + i),
  QUIZ,
];

export function buildPage(number: number, s: Service): Page {
  const count = s.channels.length;
  if (number === INDEX) return indexPage(s);
  if (number === NOW_NEXT) return nowNextPage(s);
  if (number === QUIZ) return quizPage(s);
  if (number >= TODAY && number < TODAY + count) return channelPage(s, number - TODAY, "today");
  if (number >= TOMORROW && number < TOMORROW + count) return channelPage(s, number - TOMORROW, "tomorrow");
  return missingPage(number);
}

// ---- 600: the index --------------------------------------------------------------

function indexPage(s: Service): Page {
  return {
    title: "TV listings",
    colour: "yellow",
    aside: "Index",
    info: "Page numbers work from the keypad too",
    subpages: [
      <nav key="index" className="tt-index" aria-label="Teletext pages">
        <p className="tt-index__head" aria-hidden="true">
          <span className="tt-yellow">Channel</span>
          <span className="tt-cyan">Today</span>
          <span className="tt-cyan">Tmrw</span>
        </p>
        <ul className="tt-index__list">
          {s.channels.map((c, i) => (
            <li key={c.id} className="tt-index__row">
              <span className={`tt-${COLOURS[c.id]}`}>{c.name}</span>
              <span className="tt-leader" aria-hidden="true" />
              <a href={`#${TODAY + i}`} aria-label={`${c.name} today, page ${TODAY + i}`}>
                {TODAY + i}
              </a>
              <a href={`#${TOMORROW + i}`} aria-label={`${c.name} tomorrow, page ${TOMORROW + i}`}>
                {TOMORROW + i}
              </a>
            </li>
          ))}
        </ul>
        <ul className="tt-index__list tt-index__list--more">
          <li className="tt-index__row">
            <span>Now and next</span>
            <span className="tt-leader" aria-hidden="true" />
            <a href={`#${NOW_NEXT}`}>{NOW_NEXT}</a>
          </li>
          <li className="tt-index__row">
            <span>TV quiz</span>
            <span className="tt-leader" aria-hidden="true" />
            <a href={`#${QUIZ}`}>{QUIZ}</a>
          </li>
        </ul>
        <p className="tt-cyan tt-index__hint">Type a page number, or follow the coloured keys below.</p>
      </nav>,
    ],
    fastext: [
      { label: s.channels[0].name, page: TODAY },
      { label: "Now/Next", page: NOW_NEXT },
      { label: "Tomorrow", page: TOMORROW },
      { label: "TV Quiz", page: QUIZ },
    ],
  };
}

// ---- 601–608 and 611–618: a channel's day -----------------------------------------

function channelPage(s: Service, i: number, when: "today" | "tomorrow"): Page {
  const channel = s.channels[i];
  const today = when === "today";
  const list = (today ? s.today : s.tomorrow).get(channel.id) ?? [];
  const live = today ? onAt(list, s.nowMinutes) : -1;
  const base = today ? TODAY : TOMORROW;
  const prev = s.channels[(i + s.channels.length - 1) % s.channels.length];
  const next = s.channels[(i + 1) % s.channels.length];

  return {
    title: channel.name,
    colour: COLOURS[channel.id],
    aside: today ? "Today" : "Tomorrow",
    startAt: live >= 0 ? Math.floor(live / LINES) : 0,
    info: today ? `Tomorrow's listings: ${TOMORROW + i}` : `Today's listings: ${TODAY + i}`,
    subpages: chunk(list, LINES).map((part, n) => (
      <ol key={n} className="tt-listing">
        {part.map((p) => {
          const isLive = list.indexOf(p) === live;
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
      { label: prev.name, page: base + s.channels.indexOf(prev) },
      { label: next.name, page: base + s.channels.indexOf(next) },
      today ? { label: "Tomorrow", page: TOMORROW + i } : { label: "Today", page: TODAY + i },
      { label: "Index", page: INDEX },
    ],
  };
}

// ---- 609: now and next ---------------------------------------------------------------

function nowNextPage(s: Service): Page {
  const rows = s.channels.map((channel) => {
    const list = s.today.get(channel.id) ?? [];
    const i = onAt(list, s.nowMinutes);
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
    subpages: chunk(rows, 4).map((part, n) => (
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
      { label: s.channels[0].name, page: TODAY },
      { label: "Tomorrow", page: TOMORROW },
      { label: "TV Quiz", page: QUIZ },
      { label: "Index", page: INDEX },
    ],
  };
}

// ---- 690: the quiz ------------------------------------------------------------------
// Four questions about tonight's listings, different every day. The
// answers are concealed until Reveal is pressed.

function quizPage(s: Service): Page {
  const rand = seeded(hash(`quiz:${s.todayKey}`));
  const pool = [...s.channels];
  const questions = Array.from({ length: 4 }, (_, n) => {
    const channel = pool.splice(Math.floor(rand() * pool.length), 1)[0];
    const list = s.today.get(channel.id) ?? [];
    const prime = list.filter((p) => p.start >= PRIME[0] && p.start < PRIME[1]);
    const p = pick(rand, prime.length ? prime : list);
    return n % 2 === 0
      ? { q: `What time does ${p.title} start on ${channel.name} tonight?`, a: tt(p.start) }
      : { q: `What's on ${channel.name} at ${tt(p.start)} tonight?`, a: p.title };
  });

  return {
    title: "TV quiz",
    colour: "magenta",
    info: "Press Reveal to see the answers",
    subpages: [
      <ol key="quiz" className="tt-quiz">
        {questions.map(({ q, a }, n) => (
          <li key={n}>
            <p className="tt-quiz__q">
              <span className="tt-yellow">{n + 1}</span> {q}
            </p>
            <p className="tt-quiz__a">
              Answer: <span className="tt-conceal">{a}</span>
            </p>
          </li>
        ))}
      </ol>,
    ],
    fastext: [
      { label: "Now/Next", page: NOW_NEXT },
      { label: "Today", page: TODAY },
      { label: "Tomorrow", page: TOMORROW },
      { label: "Index", page: INDEX },
    ],
  };
}

// ---- Anything else -----------------------------------------------------------------

function missingPage(number: number): Page {
  return {
    title: `Page ${number}`,
    colour: "white",
    info: "",
    subpages: [
      <div key="missing" className="tt-missing">
        <p>Page {number} is not in service.</p>
        <p className="tt-cyan">The TV index is on page {INDEX}.</p>
      </div>,
    ],
    fastext: [
      { label: "Now/Next", page: NOW_NEXT },
      { label: "Today", page: TODAY },
      { label: "Tomorrow", page: TOMORROW },
      { label: "Index", page: INDEX },
    ],
  };
}
