import type { Channel } from "../types";
import { show, liveSport } from "./shared";

// Pitchside: sport

const classicMatches = show("Classic Matches", "sport", [90, 120], ["A cup final that went to penalties, shown in full.", "The 1990s league decider, with the original commentary."]);

export const pitchside: Channel = {
  id: "pitchside",
  number: 105,
  name: "Pitchside",
  colour: "#7cc242",
  category: "Sport",
  dayparts: [
    {
      from: "06:00",
      shows: [
        show("Pitchside Today", "sport", [60], ["The morning's sport news, the back pages and the weekend ahead."], { alwaysNew: true }),
        classicMatches,
        show("Golf: Coastal Open", "sport", [60], ["Highlights from the links, where the wind decides who wins."]),
      ],
    },
    {
      from: "12:00",
      shows: [
        liveSport("Snooker, Northern Masters", [180, 240], ["The afternoon session from the Crucible of the North."]),
        liveSport("Cycling, Tour of the Dales", [180], ["Stage four: 180 kilometres and three categorised climbs."]),
      ],
    },
    { from: "17:00", shows: [show("Pitchside Tonight", "sport", [60], ["The day's results, the build-up and the team news."], { alwaysNew: true })] },
    { from: "18:00", shows: [classicMatches, show("Rugby: Premiership Rewind", "sport", [90], ["Every try from the weekend's round of matches."])] },
    {
      from: "19:30",
      shows: [
        liveSport("Football, Super League", [120], ["Top of the table meets bottom, and nothing is settled."]),
        liveSport("Darts, Premier Arrows", [180], ["Eight players, one night, and the nine-darter bonus is still up for grabs."]),
      ],
    },
    { from: "22:30", shows: [show("Match of the Night", "sport", [75], ["Every goal from tonight's games, and the arguments about them."], { alwaysNew: true })] },
    { from: "23:45", shows: [show("The Debate", "sport", [60], ["Three pundits, one table, no agreement."], { alwaysNew: true }), classicMatches] },
  ],
};
