import type { Genre, Show } from "../types";

/** Helpers for writing a channel's shows. */

export const show = (title: string, genre: Genre, durations: number[], blurbs: string[], extra: Partial<Show> = {}): Show => ({
  title,
  genre,
  durations,
  blurbs,
  ...extra,
});

/** A film: one length, and its year at the start of the description. */
export const film = (title: string, year: number, minutes: number, blurbs: string[]) =>
  show(title, "film", [minutes], blurbs.map((b) => `(${year}) ${b}`));

/** A news bulletin, new every time. */
export const bulletin = (title: string, minutes: number) =>
  show(title, "news", [minutes], ["The latest national and international news, with sport and the weather."], { alwaysNew: true });

/** Sport shown live: always new, and marked as live in the guide. */
export const liveSport = (title: string, durations: number[], blurbs: string[]) =>
  show(`Live: ${title}`, "sport", durations, blurbs, { alwaysNew: true, live: true });
