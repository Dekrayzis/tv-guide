import { hash, pick, seeded, type Rand } from "../lib/random";
import { DAY_MINUTES, inPrimeTime, minutesFromStart } from "../lib/time";
import { CHANNELS } from "./channels";
import type { Channel, Programme, Show } from "./types";

export type Listings = ReadonlyMap<string, readonly Programme[]>;

const days = new Map<string, Listings>();

/**
 * Every channel's listings for a day, by channel id. A day's listings never
 * change, so each day is generated once and kept.
 */
export function listingsFor(dayKey: string): Listings {
  let listings = days.get(dayKey);
  if (!listings) {
    listings = new Map(CHANNELS.map((c) => [c.id, scheduleFor(c, dayKey)]));
    days.set(dayKey, listings);
  }
  return listings;
}

/** One channel's listings for a day. */
export const channelListings = (dayKey: string, channelId: string) => listingsFor(dayKey).get(channelId) ?? [];

/**
 * A channel's full broadcast day, 06:00 to 06:00, for a date. It's seeded
 * from the channel and the date, so the same day always gets the same
 * listings, for every visitor.
 */
function scheduleFor(channel: Channel, dayKey: string): Programme[] {
  const rand = seeded(hash(`${channel.id}:${dayKey}`));
  const listings: Programme[] = [];
  const parts = channel.dayparts;

  parts.forEach((part, i) => {
    const end = i + 1 < parts.length ? minutesFromStart(parts[i + 1].from) : DAY_MINUTES;
    // A long show in the last daypart can overrun into this one: start after it.
    let t = Math.max(minutesFromStart(part.from), listings.at(-1)?.end ?? 0);
    let previous: Show | undefined;

    while (t < end) {
      const room = end - t;
      const fits = part.shows.filter((s) => Math.min(...s.durations) <= room && (s !== previous || part.shows.length === 1));
      if (!fits.length) {
        // Too little time left for anything: the last programme runs on.
        if (listings.length) listings[listings.length - 1].end = end;
        break;
      }
      const chosen = pick(rand, fits);
      const length = pick(rand, chosen.durations.filter((d) => d <= room));
      listings.push(listing(channel, dayKey, chosen, t, t + length, rand));
      previous = chosen;
      t += length;
    }
  });

  return listings;
}

function listing(channel: Channel, dayKey: string, s: Show, start: number, end: number, rand: Rand): Programme {
  const episodeIndex = s.episodes ? Math.floor(rand() * s.episodes.length) : -1;
  // A show keeps the same series number all week; the episode is its place in the list.
  const seriesNumber = 1 + (hash(s.title) % 7);
  return {
    id: `${channel.id}-${dayKey}-${start}`,
    channelId: channel.id,
    dayKey,
    title: s.title,
    genre: s.genre,
    start,
    end,
    episode: s.episodes?.[episodeIndex],
    series: s.episodes ? `Series ${seriesNumber}, episode ${episodeIndex + 1}` : undefined,
    seriesTag: s.episodes ? `S${seriesNumber} E${episodeIndex + 1}` : undefined,
    blurb: pick(rand, s.blurbs),
    isNew: s.alwaysNew || (s.genre !== "film" && rand() < (inPrimeTime(start) ? 0.6 : 0.15)),
    isLive: Boolean(s.live),
    subtitles: rand() < 0.9,
    audioDescribed: ["drama", "film", "documentary"].includes(s.genre) && rand() < 0.45,
  };
}
