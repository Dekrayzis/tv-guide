import type { Channel } from "../types";
import { show } from "./shared";

// Pulse: music and gaming

const patchNotes = show("Patch Notes", "gaming", [30], ["This week's game news, releases and the update that broke everything."], { alwaysNew: true });

export const pulse: Channel = {
  id: "pulse",
  number: 108,
  name: "Pulse",
  colour: "#14c4dc",
  category: "Music & games",
  dayparts: [
    {
      from: "06:00",
      shows: [
        show("Wake Up Mix", "music", [60, 120], ["Non-stop videos to get you out of bed."]),
        show("Chart Rundown", "music", [60], ["The official top forty, counted down."], { alwaysNew: true }),
      ],
    },
    {
      from: "12:00",
      shows: [
        show("Pulse Hits", "music", [60], ["The biggest videos right now, back to back."]),
        show("Speedrun Live", "gaming", [60, 90], ["Runners take on a classic platformer, and the timer never stops."], { alwaysNew: true }),
        patchNotes,
        show("Retro Rewind", "gaming", [30], ["The consoles, cartridges and cheat codes of the 1990s."]),
      ],
    },
    {
      from: "19:00",
      shows: [
        patchNotes,
        show("Live from Hall Four", "music", [60, 90], ["A full live set from the venue that breaks the bands first."], { alwaysNew: true }),
        show("The Leaderboard", "gaming", [120], ["The weekly esports round-up, with the finals live from the arena."], { alwaysNew: true }),
      ],
    },
    { from: "23:00", shows: [show("Night Shift Mix", "music", [60, 120], ["Electronic, ambient and late-night videos until the sun comes up."])] },
  ],
};
