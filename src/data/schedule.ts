import { hash, pick, seeded, type Rand } from "../lib/random";
import { DAY_MINUTES, minutesFromStart } from "../lib/time";
import type { Channel, Programme, Show } from "./types";

/** Prime time, in minutes from the 06:00 start: 19:00 to 22:30. */
const PRIME = [minutesFromStart("19:00"), minutesFromStart("22:30")] as const;

/**
 * A channel's full broadcast day, 06:00 to 06:00, for a date. It's seeded
 * from the channel and the date, so the same day always gets the same
 * listings, for every visitor.
 */
export function scheduleFor(channel: Channel, dayKey: string): Programme[] {
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
  const inPrime = start >= PRIME[0] && start < PRIME[1];
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
    isNew: s.alwaysNew || (s.genre !== "film" && rand() < (inPrime ? 0.6 : 0.15)),
    subtitles: rand() < 0.9,
    audioDescribed: ["drama", "film", "documentary"].includes(s.genre) && rand() < 0.45,
  };
}
