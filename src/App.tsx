import { useMemo, useRef, useState } from "react";
import { CHANNELS } from "./data/channels";
import { scheduleFor } from "./data/schedule";
import type { Genre, Programme } from "./data/types";
import { addDays, broadcastDay, dayKey, minutesInto } from "./lib/time";
import { useNow } from "./lib/useNow";
import { DayPicker } from "./components/DayPicker";
import { GenreFilter } from "./components/GenreFilter";
import { Guide, type GuideHandle } from "./components/Guide";
import { DetailsDialog } from "./components/DetailsDialog";

const WEEK = 7;

const clockFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

/**
 * Signal: a week of listings for eight made-up channels. The guide is
 * generated on the fly (see data/schedule.ts), so any day has a full
 * schedule without a server.
 */
export function App() {
  const now = useNow();
  const today = broadcastDay(now);
  const days = useMemo(() => Array.from({ length: WEEK }, (_, i) => addDays(today, i)), [dayKey(today)]);

  const [dayIndex, setDayIndex] = useState(0);
  const [genres, setGenres] = useState<ReadonlySet<Genre>>(new Set());
  const [open, setOpen] = useState<Programme | null>(null);
  const guide = useRef<GuideHandle>(null);

  const day = days[dayIndex];
  const key = dayKey(day);
  const listings = useMemo(() => new Map(CHANNELS.map((c) => [c.id, scheduleFor(c, key)])), [key]);
  // Where "now" falls in the day on show, or null when it's another day.
  const nowMinutes = dayIndex === 0 ? minutesInto(day, now) : null;

  const jumpToNow = () => {
    if (dayIndex !== 0) setDayIndex(0);
    // Wait for the day to render before scrolling to it.
    requestAnimationFrame(() => guide.current?.scrollToNow());
  };

  return (
    <div className="app">
      <header className="masthead">
        <p className="masthead__brand">
          <span className="masthead__logo" aria-hidden="true" />
          Signal
          <span className="masthead__sub">TV guide</span>
        </p>
        <p className="masthead__clock">
          <time dateTime={now.toISOString()}>{clockFormat.format(now)}</time>
        </p>
        <button type="button" className="masthead__now" onClick={jumpToNow}>
          On now
        </button>
      </header>

      <main className="app__main">
        <h1 className="sr-only">TV guide</h1>
        <div className="toolbar">
          <DayPicker days={days} value={dayIndex} onChange={setDayIndex} />
          <GenreFilter value={genres} onChange={setGenres} />
        </div>

        <Guide
          ref={guide}
          key={key}
          day={day}
          channels={CHANNELS}
          listings={listings}
          nowMinutes={nowMinutes}
          genres={genres}
          onOpen={setOpen}
        />
      </main>

      <DetailsDialog programme={open} nowMinutes={nowMinutes} onClose={() => setOpen(null)} />
    </div>
  );
}
