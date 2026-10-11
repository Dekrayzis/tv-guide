# Signal

A TV guide for eight made-up channels, with a full week of listings that's generated in the browser.

- **A schedule for any day.** Each channel splits its day into dayparts (breakfast, daytime, prime time, overnight) with a list of shows for each. A seeded generator fills 06:00 to 06:00 from those lists, so a given date always gets the same listings, for every visitor, with no server.
- **The grid.** Channels run down the side and time runs across the top. Each programme is sized to its length, and a live line marks the current time. The ruler and the channel column stay put while you scroll, and a title stays in view while its programme scrolls under the channel column.
- **Keyboard first.** It's an ARIA grid with a single tab stop:
  - The arrow keys move between programmes. Up and down keep to the same time.
  - Home and End go to either end of a channel's day.
  - Enter opens a programme's details.
- **Filters.** You can pick a day of the week, highlight genres, and search titles, episodes and channels. Enter in the search box jumps to the next match.
- **Artwork.** Every show has a picture drawn in code, a scene for its genre varied by its title. Each channel has its own logo.
- **Favourites.** Starred channels move to the top, and the browser remembers them.
- **Details.** Opening a programme shows its art, how long is left (or until it starts), what's next on the channel, and when else it's on this week.
- **Teletext mode.** The same listings as a 1980s teletext service, with page numbers in the URL so Back works:
  - **Pages:** 600 is the index, 601–608 each channel today, 611–618 tomorrow, 609 now and next, and 690 a quiz about tonight's schedule.
  - **Layout:** 40 × 25 characters of pixel font, stretched to a 4:3 screen, with double-height titles and mosaic block lettering.
  - **Behaviour:** the header counter rolls while a page is found, subpages turn over by themselves until you press Hold, the quiz answers stay concealed until Reveal, and the four Fastext keys run along the bottom.
  - **Controls:** type a page number on the keyboard or the on-screen remote. The coloured keys follow the Fastext links, up and down step through the pages, and left and right turn subpages.

## Running it

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`.

## Layout

| Path | What's there |
| --- | --- |
| `src/data/channels/` | One file per channel: its dayparts and shows. `shared.ts` has the helpers they're written with |
| `src/data/schedule.ts` | The seeded generator, and `listingsFor(day)`, which builds each day once and keeps it |
| `src/lib/` | Time, formatting, motion and set helpers, the seeded random generator, and the clock, favourites and URL-page hooks |
| `src/components/guide/` | The grid: ruler, channel headers, programme cells, and the keyboard navigation hook |
| `src/components/details/` | The programme details dialog and what it suggests next |
| `src/components/art/` | The drawn artwork: painting helpers and one scene per genre |
| `src/teletext/` | Teletext mode: the set, the remote, the page-search, subpage and keyboard hooks, and `pages/` with one file per page |
| `src/styles/` | Sass: tokens, then one partial per part of the page |
