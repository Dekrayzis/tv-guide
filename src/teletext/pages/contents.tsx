import { CHANNELS } from "../../data/channels";
import { COLOURS, NOW_NEXT, QUIZ, TODAY, TOMORROW, type Page } from "./shared";

/** 600: the index, with a dotted line from each channel to its pages. */
export function contentsPage(): Page {
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
          {CHANNELS.map((c, i) => (
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
      { label: CHANNELS[0].name, page: TODAY },
      { label: "Now/Next", page: NOW_NEXT },
      { label: "Tomorrow", page: TOMORROW },
      { label: "TV Quiz", page: QUIZ },
    ],
  };
}
