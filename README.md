# Signal

A TV guide for eight made-up channels, with a full week of listings that's generated in the browser.

- **A schedule for any day.** Each channel splits its day into dayparts (breakfast, daytime, prime time, overnight) with a list of shows for each. A seeded generator fills 06:00 to 06:00 from those lists, so a given date always gets the same listings, for every visitor, with no server.
- **The grid.** Channels run down the side and time runs across the top. Each programme is sized to its length, and a live line marks the current time. The ruler and the channel column stay put while you scroll, and a title stays in view while its programme scrolls under the channel column.
- **Keyboard first.** It's an ARIA grid with a single tab stop:
  - The arrow keys move between programmes. Up and down keep to the same time.
  - Home and End go to either end of a channel's day.
  - Enter opens a programme's details.
- **Filters.** You can pick a day of the week and highlight genres.

## Running it

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`.

## Layout

| Path | What's there |
| --- | --- |
| `src/data/channels.ts` | The channels, their dayparts and their shows |
| `src/data/schedule.ts` | The seeded generator that turns those into a day's listings |
| `src/lib/` | Time helpers, the seeded random generator, and a ticking clock hook |
| `src/components/` | The grid, the day picker, the genre filters and the details dialog |
| `src/styles/` | Sass: tokens and the app's styles |
