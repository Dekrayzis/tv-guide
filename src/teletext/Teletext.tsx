import { useState } from "react";
import { listingsFor } from "../data/schedule";
import { addDays, broadcastDay, dayKey, minutesInto } from "../lib/time";
import { Mosaic } from "./Mosaic";
import { PAGES_IN_SERVICE, buildPage, type Colour } from "./pages";
import { Remote } from "./Remote";
import { TeletextHeader } from "./TeletextHeader";
import { usePageFit } from "./usePageFit";
import { usePageSearch } from "./usePageSearch";
import { useRemoteKeys } from "./useRemoteKeys";
import { useSubpages } from "./useSubpages";

/** The Fastext row's colours on screen, in key order. */
const FASTEXT: readonly Colour[] = ["red", "green", "yellow", "cyan"];

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
  const { shown, counter } = usePageSearch(page);

  const data = buildPage(shown, {
    today: listingsFor(todayKey),
    tomorrow: listingsFor(dayKey(addDays(today, 1))),
    todayKey,
    nowMinutes: minutesInto(today, now),
  });
  const subpages = useSubpages(shown, data.subpages.length, data.startAt);
  const hasSubpages = subpages.count > 1;

  // Reveal belongs to the page it was pressed on.
  const [revealedOn, setRevealedOn] = useState<number | null>(null);
  const revealed = revealedOn === shown;

  // A page number being typed, one digit at a time.
  const [entry, setEntry] = useState("");
  const press = (digit: string) => {
    // Teletext pages run from 100 to 899.
    if (!entry && (digit === "0" || digit === "9")) return;
    const next = entry + digit;
    if (next.length < 3) return setEntry(next);
    setEntry("");
    go(Number(next));
  };

  // Up and down: the next or previous page in service, wrapping round, as P+ and P- did.
  const step = (dir: 1 | -1) => {
    const beyond = PAGES_IN_SERVICE.filter((n) => (dir > 0 ? n > page : n < page));
    go(dir > 0 ? beyond[0] ?? PAGES_IN_SERVICE[0] : beyond.at(-1) ?? PAGES_IN_SERVICE.at(-1)!);
  };

  const turn = (dir: 1 | -1) => hasSubpages && subpages.turn(dir);

  useRemoteKeys({ digit: press, cancel: () => setEntry(""), page: step, subpage: turn });
  const { screen, sheet } = usePageFit();

  return (
    <section className="tt" aria-label="Teletext">
      <div className="tt__set">
        <div ref={screen} className="tt__screen">
          <div ref={sheet} className={revealed ? "tt-page is-revealed" : "tt-page"}>
            <TeletextHeader target={entry ? entry.padEnd(3, "-") : String(page)} counter={counter} />

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

            <div className="tt-body">{data.subpages[subpages.index]}</div>

            <p className="tt-info">
              <span className="tt-cyan">{data.info}</span>
              {hasSubpages && (
                <span>
                  {subpages.hold && <span className="tt-hold">HOLD</span>} {subpages.index + 1}/{subpages.count}
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

      <Remote
        fastext={data.fastext}
        onDigit={press}
        onPage={step}
        onSubpage={turn}
        hasSubpages={hasSubpages}
        hold={subpages.hold}
        onHold={() => subpages.setHold(!subpages.hold)}
        revealed={revealed}
        onReveal={() => setRevealedOn(revealed ? null : shown)}
      />

      <p className="sr-only" aria-live="polite">
        Page {shown}, {data.title}
      </p>
    </section>
  );
}
