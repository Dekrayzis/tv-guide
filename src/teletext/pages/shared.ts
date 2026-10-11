import type { ReactNode } from "react";
import type { Listings } from "../../data/schedule";
import { clock } from "../../lib/time";

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

/** What every page is built from. */
export type Service = {
  today: Listings;
  tomorrow: Listings;
  todayKey: string;
  /** Minutes into today's broadcast day. */
  nowMinutes: number;
};

/** Rows in a page's body. */
export const LINES = 16;

export const INDEX = 600;
export const TODAY = 601;
export const NOW_NEXT = 609;
export const TOMORROW = 611;
export const QUIZ = 690;

/** Each channel's colour, from the eight teletext could show (blue text is too dark to read on black). */
export const COLOURS: Record<string, Colour> = {
  "signal-one": "red",
  northlight: "cyan",
  brightside: "yellow",
  atlas: "green",
  pitchside: "white",
  tumbletime: "magenta",
  rewind: "yellow",
  pulse: "cyan",
};

/** The keys on pages that aren't about one channel. */
export const GENERAL_FASTEXT: Page["fastext"] = [
  { label: "Now/Next", page: NOW_NEXT },
  { label: "Today", page: TODAY },
  { label: "Tomorrow", page: TOMORROW },
  { label: "Index", page: INDEX },
];

/** Teletext times: "19.00". */
export const tt = (minutes: number) => clock(minutes).replace(":", ".");

/** `items` in runs of `size`, one per subpage. */
export const chunk = <T,>(items: readonly T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
