import { useEffect, useState } from "react";
import { lessMotion } from "../lib/motion";

/** How long the header counter rolls before a page "arrives". */
const SEARCH_MS = 700;
/** How often the counter changes while it rolls. */
const ROLL_MS = 40;

/**
 * A page being found, as on a real set: asking for a page leaves the old one
 * on screen while the header counter rolls through other numbers, then the
 * new page arrives. With less motion asked for, it arrives at once.
 *
 * Returns the page on screen and the number the counter shows.
 */
export function usePageSearch(page: number) {
  const [shown, setShown] = useState(page);
  const [counter, setCounter] = useState(page);

  useEffect(() => {
    if (page === shown) return;
    const arrive = () => {
      setCounter(page);
      setShown(page);
    };
    if (lessMotion()) return arrive();
    const roll = setInterval(() => setCounter(100 + Math.floor(Math.random() * 800)), ROLL_MS);
    const done = setTimeout(() => {
      clearInterval(roll);
      arrive();
    }, SEARCH_MS);
    return () => {
      clearInterval(roll);
      clearTimeout(done);
    };
  }, [page, shown]);

  return { shown, counter };
}
