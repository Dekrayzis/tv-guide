import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CHANNELS } from "../data/channels";
import { scheduleFor } from "../data/schedule";
import { addDays, broadcastDay, dayKey, minutesInto } from "../lib/time";
import { useNow } from "../lib/useNow";
import { Mosaic } from "./Mosaic";
import { buildPage, type Colour } from "./pages";

/** How long a subpage stays up before the next rotates in. */
const ROTATE_MS = 12_000;
/** How long the header counter rolls before a page "arrives". */
const SEARCH_MS = 700;
const FASTEXT: readonly Colour[] = ["red", "green", "yellow", "cyan"];
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const lessMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short" });
const two = (n: number) => String(n).padStart(2, "0");

type Props = {
  page: number;
  go: (page: number) => void;
  now: Date;
};

/**
 * Signal's teletext service, in the style of the 1980s: a 40 × 25 page of
 * coloured text, a header counter that rolls while a page is "found",
 * subpages that turn over by themselves (Hold stops them), concealed
 * answers, and the four Fastext keys along the bottom.
 */
export function Teletext({ page, go, now }: Props) {
  const today = broadcastDay(now);
  const todayKey = dayKey(today);
  const tomorrowKey = dayKey(addDays(today, 1));
  const todayListings = useMemo(() => new Map(CHANNELS.map((c) => [c.id, scheduleFor(c, todayKey)])), [todayKey]);
  const tomorrowListings = useMemo(() => new Map(CHANNELS.map((c) => [c.id, scheduleFor(c, tomorrowKey)])), [tomorrowKey]);

  // The page on screen lags the page asked for while the counter rolls.
  const [shown, setShown] = useState(page);
  const [counter, setCounter] = useState(page);
  useEffect(() => {
    if (page === shown) return;
    if (lessMotion()) {
      setShown(page);
      setCounter(page);
      return;
    }
    const roll = setInterval(() => setCounter(100 + Math.floor(Math.random() * 800)), 40);
    const arrive = setTimeout(() => {
      clearInterval(roll);
      setCounter(page);
      setShown(page);
    }, SEARCH_MS);
    return () => {
      clearInterval(roll);
      clearTimeout(arrive);
    };
  }, [page, shown]);

  const data = buildPage(shown, {
    channels: CHANNELS,
    today: todayListings,
    tomorrow: tomorrowListings,
    todayKey,
    nowMinutes: minutesInto(today, now),
  });
  const count = data.subpages.length;

  // Subpage, Reveal and the half-typed page number all belong to the page on show.
  const [sub, setSub] = useState({ page: shown, index: data.startAt ?? 0 });
  const subIndex = sub.page === shown ? Math.min(sub.index, count - 1) : data.startAt ?? 0;
  const turn = (step: number) => setSub({ page: shown, index: (subIndex + step + count) % count });
  const [hold, setHold] = useState(false);
  const [revealedOn, setRevealedOn] = useState<number | null>(null);
  const revealed = revealedOn === shown;
  const [entry, setEntry] = useState("");

  useEffect(() => {
    if (hold || count < 2) return;
    const id = setTimeout(() => turn(1), ROTATE_MS);
    return () => clearTimeout(id);
  });

  const press = (digit: string) => {
    // Teletext pages run from 100 to 899.
    if (!entry && (digit === "0" || digit === "9")) return;
    const next = entry + digit;
    if (next.length < 3) return setEntry(next);
    setEntry("");
    go(Number(next));
  };

  // Digits typed anywhere go to the page number, as on a remote.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return;
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      if (/^\d$/.test(event.key)) press(event.key);
      else if (event.key === "Escape" && entry) setEntry("");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  // The page is laid out 40 characters wide, then stretched to fill the screen.
  const screen = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      if (screen.current && sheet.current) {
        sheet.current.style.setProperty("--sx", String(screen.current.clientWidth / sheet.current.offsetWidth));
      }
    };
    // Watch the page too: it changes width when the pixel font arrives.
    const observer = new ResizeObserver(fit);
    observer.observe(screen.current!);
    observer.observe(sheet.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="tt" aria-label="Teletext">
      <div className="tt__set">
        <div ref={screen} className="tt__screen">
          <div ref={sheet} className={revealed ? "tt-page is-revealed" : "tt-page"}>
            <Header target={entry ? entry.padEnd(3, "-") : String(page)} counter={counter} />

            <div className="tt-banner">
              <Mosaic text="Signal" />
              <p className="tt-banner__side">
                <span className="tt-double">TV GUIDE</span>
              </p>
            </div>

            <h2 className={`tt-title tt-${data.colour}`}>
              <span className="tt-double">{data.title}</span>
              {data.aside && <span className="tt-double tt-white">{data.aside}</span>}
            </h2>

            <div className="tt-body">{data.subpages[subIndex]}</div>

            <p className="tt-info">
              <span className="tt-cyan">{data.info}</span>
              {count > 1 && (
                <span>
                  {hold && <span className="tt-hold">HOLD</span>} {subIndex + 1}/{count}
                </span>
              )}
            </p>

            <nav className="tt-fastext" aria-label="Fastext">
              <ul>
                {data.fastext.map((f, i) => (
                  <li key={i}>
                    <a href={`#${f.page}`} className={`tt-${FASTEXT[i]}`}>
                      {f.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="remote" role="group" aria-label="Remote control">
        <div className="remote__keypad">
          {KEYPAD.map((digit) => (
            <button key={digit} type="button" className="remote__key" onClick={() => press(digit)}>
              {digit}
            </button>
          ))}
        </div>
        <div className="remote__row">
          <button type="button" className="remote__key" aria-label="Previous subpage" disabled={count < 2} onClick={() => turn(-1)}>
            ◂
          </button>
          <button type="button" className="remote__key remote__key--wide" aria-pressed={hold} disabled={count < 2} onClick={() => setHold(!hold)}>
            Hold
          </button>
          <button type="button" className="remote__key" aria-label="Next subpage" disabled={count < 2} onClick={() => turn(1)}>
            ▸
          </button>
        </div>
        <button
          type="button"
          className="remote__key remote__key--wide"
          aria-pressed={revealed}
          onClick={() => setRevealedOn(revealed ? null : shown)}
        >
          Reveal
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Page {shown}, {data.title}
      </p>
    </section>
  );
}

/** Row 0: the page asked for, the service, the rolling counter, the date and a clock with seconds. */
function Header({ target, counter }: { target: string; counter: number }) {
  const now = useNow(1000);
  return (
    <p className="tt-header">
      <span>P{target}</span>
      <span>SIGNAL</span>
      <span aria-hidden="true">{counter}</span>
      <span>{headerDate.format(now).replace(",", "")}</span>
      <time className="tt-yellow" dateTime={now.toISOString()}>
        {two(now.getHours())}:{two(now.getMinutes())}/{two(now.getSeconds())}
      </time>
    </p>
  );
}
