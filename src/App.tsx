import { useMemo, useRef, useState, type FormEvent } from "react";
import { CHANNELS } from "./data/channels";
import { scheduleFor } from "./data/schedule";
import type { Genre, Programme } from "./data/types";
import { addDays, broadcastDay, dayKey, minutesInto } from "./lib/time";
import { useNow } from "./lib/useNow";
import { useFavourites } from "./lib/useFavourites";
import { useHashPage } from "./lib/useHashPage";
import { DayPicker } from "./components/DayPicker";
import { GenreFilter } from "./components/GenreFilter";
import { Guide, type GuideHandle } from "./components/Guide";
import { DetailsDialog } from "./components/DetailsDialog";
import { Teletext } from "./teletext/Teletext";
import { INDEX } from "./teletext/pages";

const WEEK = 7;

const clockFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

/**
 * Signal: a week of listings for eight made-up channels. The guide is
 * generated on the fly (see data/schedule.ts), so any day has a full
 * schedule without a server.
 */
export function App() {
  const now = useNow(15_000);
  const today = broadcastDay(now);
  const days = useMemo(() => Array.from({ length: WEEK }, (_, i) => addDays(today, i)), [dayKey(today)]);

  const [dayIndex, setDayIndex] = useState(0);
  const [genres, setGenres] = useState<ReadonlySet<Genre>>(new Set());
  const [query, setQuery] = useState("");
  const [searchNote, setSearchNote] = useState("");
  const [open, setOpen] = useState<Programme | null>(null);
  const [favourites, toggleFavourite] = useFavourites();
  const guide = useRef<GuideHandle>(null);
  const [page, go] = useHashPage();
  const teletext = page !== null;

  const dayKeys = useMemo(() => days.map(dayKey), [days]);
  const day = days[dayIndex];
  const key = dayKey(day);
  const listings = useMemo(() => new Map(CHANNELS.map((c) => [c.id, scheduleFor(c, key)])), [key]);
  // Where "now" falls in the day on show, or null when it's another day.
  const nowMinutes = dayIndex === 0 ? minutesInto(day, now) : null;

  // Favourite channels move to the top, otherwise in channel-number order.
  const channels = useMemo(
    () => [...CHANNELS].sort((a, b) => Number(favourites.has(b.id)) - Number(favourites.has(a.id)) || a.number - b.number),
    [favourites],
  );

  // A programme passes when it's in a highlighted genre (or none are), and
  // its title, episode or channel contains the search.
  const needle = query.trim().toLowerCase();
  const matches = (p: Programme) => {
    if (genres.size && !genres.has(p.genre)) return false;
    if (!needle) return true;
    const channel = CHANNELS.find((c) => c.id === p.channelId)!;
    return [p.title, p.episode ?? "", channel.name].some((text) => text.toLowerCase().includes(needle));
  };
  const matchCount = useMemo(
    () => (needle || genres.size ? [...listings.values()].flat().filter(matches).length : null),
    [needle, genres, listings],
  );

  const jumpToNow = () => {
    if (dayIndex !== 0) setDayIndex(0);
    // Wait for the day to render before scrolling to it.
    requestAnimationFrame(() => guide.current?.scrollToNow());
  };

  // Enter in the search box goes to the next matching programme.
  const findNext = (event: FormEvent) => {
    event.preventDefault();
    if (!needle) return;
    const found = guide.current?.reveal(matches);
    setSearchNote(found ? "" : `Nothing coming up matches “${query.trim()}” on this day.`);
  };

  return (
    <div className="app">
      <header className="masthead">
        <p className="masthead__brand">
          <svg className="masthead__logo" viewBox="0 0 32 32" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
              <path d="M7 14a11 11 0 0 1 11 11" />
              <path d="M7 6a19 19 0 0 1 19 19" />
              <circle cx="9" cy="23" r="3" fill="currentColor" stroke="none" />
            </g>
          </svg>
          Signal
          <span className="masthead__sub">TV Guide</span>
        </p>

        {!teletext && (
          <form role="search" className="finder" onSubmit={findNext}>
            <label htmlFor="finder" className="sr-only">
              Search channels or shows
            </label>
            <svg className="finder__icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              id="finder"
              type="search"
              className="finder__input"
              placeholder="Search channels or shows…"
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchNote("");
              }}
            />
          </form>
        )}

        <button type="button" className="masthead__mode" aria-pressed={teletext} onClick={() => go(teletext ? null : INDEX)}>
          Teletext
        </button>
      </header>

      <main className={teletext ? "app__main app__main--teletext" : "app__main"}>
        <h1 className="sr-only">TV guide</h1>
        {teletext ? (
          <Teletext page={page} go={go} now={now} />
        ) : (
          <>
            <div className="toolbar">
              <DayPicker days={days} value={dayIndex} onChange={setDayIndex} />
              <GenreFilter value={genres} onChange={setGenres} />
              <p className="toolbar__status" role="status">
                {searchNote ||
                  (matchCount !== null && `${matchCount} ${matchCount === 1 ? "programme matches" : "programmes match"}`)}
              </p>
            </div>

            <Guide
              ref={guide}
              key={key}
              day={day}
              channels={channels}
              listings={listings}
              nowMinutes={nowMinutes}
              clockText={clockFormat.format(now)}
              onNow={jumpToNow}
              matches={matches}
              favourites={favourites}
              onFavourite={toggleFavourite}
              onOpen={setOpen}
            />
          </>
        )}
      </main>

      <DetailsDialog
        programme={open}
        dayKeys={dayKeys}
        nowMinutes={minutesInto(today, now)}
        onOpen={setOpen}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
