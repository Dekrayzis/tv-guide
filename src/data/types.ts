/** The shapes the guide is built from. */

export type Genre = "news" | "drama" | "comedy" | "documentary" | "entertainment" | "film" | "sport" | "kids" | "lifestyle" | "music" | "gaming";

/** A show a channel can schedule: the template each listing is made from. */
export type Show = {
  title: string;
  genre: Genre;
  /** Lengths it runs at, in minutes. */
  durations: readonly number[];
  /** One-line descriptions; an episode gets one of them. */
  blurbs: readonly string[];
  /** Episode titles, for a series; a film or bulletin has none. */
  episodes?: readonly string[];
  /** Repeat showings are marked; some shows are always new (news, live sport). */
  alwaysNew?: boolean;
};

/** Part of a channel's day, and the shows it draws from. */
export type Daypart = {
  /** Start time, "HH:MM", in the broadcast day (which starts at 06:00). */
  from: string;
  shows: readonly Show[];
};

export type Channel = {
  id: string;
  number: number;
  name: string;
  /** A short mark for the logo tile, two or three characters. */
  mark: string;
  colour: string;
  /** What the channel is about, for its tooltip and the details dialog. */
  tagline: string;
  dayparts: readonly Daypart[];
};

/** One listing in the guide. Times are minutes from the start of the broadcast day. */
export type Programme = {
  id: string;
  channelId: string;
  title: string;
  genre: Genre;
  start: number;
  end: number;
  episode?: string;
  /** e.g. "Series 3, episode 4". */
  series?: string;
  blurb: string;
  isNew: boolean;
  subtitles: boolean;
  audioDescribed: boolean;
};
