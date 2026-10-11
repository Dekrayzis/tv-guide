/**
 * Time in the guide. A broadcast day runs from 06:00 to 06:00 the next
 * morning, and positions within it are minutes from that 06:00.
 */

export const DAY_START_HOUR = 6;
export const DAY_MINUTES = 24 * 60;

/** "HH:MM" (in the broadcast day) as minutes from its 06:00 start. */
export function minutesFromStart(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (((h - DAY_START_HOUR) * 60 + m) % DAY_MINUTES + DAY_MINUTES) % DAY_MINUTES;
}

/** Minutes from the 06:00 start as a clock time, "21:30". */
export function clock(minutes: number) {
  const total = (minutes + DAY_START_HOUR * 60) % DAY_MINUTES;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** A length in minutes as words, "1 hr 30 min". */
export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(" ");
}

/** The broadcast day a moment falls in (before 06:00 still counts as the day before). */
export function broadcastDay(at: Date) {
  const day = new Date(at);
  if (day.getHours() < DAY_START_HOUR) day.setDate(day.getDate() - 1);
  day.setHours(0, 0, 0, 0);
  return day;
}

/** Minutes into the broadcast day `day` that `at` is (may be outside 0–1440). */
export function minutesInto(day: Date, at: Date) {
  const start = new Date(day);
  start.setHours(DAY_START_HOUR, 0, 0, 0);
  return (at.getTime() - start.getTime()) / 60000;
}

/** A date as a key, "2026-10-11", for seeding and URLs. */
export function dayKey(day: Date) {
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
}

export function addDays(day: Date, n: number) {
  const next = new Date(day);
  next.setDate(next.getDate() + n);
  return next;
}

/** Prime time, in minutes from the 06:00 start: 19:00 to 22:30. */
export const PRIME_TIME = { start: minutesFromStart("19:00"), end: minutesFromStart("22:30") } as const;

export const inPrimeTime = (minute: number) => minute >= PRIME_TIME.start && minute < PRIME_TIME.end;

/** Whether something with a start and end (in minutes) is on at `minute`. */
export const isOnAt = (span: { start: number; end: number }, minute: number) => span.start <= minute && minute < span.end;

/** A day key, "2026-10-13", as a date. */
export function dateFromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
