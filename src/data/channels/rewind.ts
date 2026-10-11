import type { Channel } from "../types";
import { show, film } from "./shared";

// Rewind: classic television

export const rewind: Channel = {
  id: "rewind",
  number: 107,
  name: "Rewind",
  colour: "#b48cff",
  category: "Classic TV",
  dayparts: [
    {
      from: "06:00",
      shows: [
        show("Holiday Camp", "comedy", [30], ["The entertainment manager has double-booked the ballroom. Again."], { episodes: ["Knobbly Knees", "Talent Night", "Rain Stopped Play"] }),
        show("The Copper's Beat", "drama", [50], ["(1976) Sergeant Briggs walks the beat in a town that's changing faster than he is."], { episodes: ["The Long Walk", "Market Day", "Closing Time"] }),
        show("Wheel of Wealth", "entertainment", [30], ["(1985) Spin the wheel, answer the question, and try not to land on Bankrupt."]),
      ],
    },
    {
      from: "13:00",
      shows: [
        film("A Platform at Crewe", 1962, 95, ["Two commuters, one station café, and a train neither of them wants to catch."]),
        film("Caravan of Fools", 1971, 90, ["A coach party heads for the coast and ends up in a field in Wales."]),
        film("The Lodgers", 1968, 100, ["A gang of crooks lodges with a little old lady who's more than a match for them."]),
      ],
    },
    {
      from: "16:00",
      shows: [
        show("Holiday Camp", "comedy", [30], ["A coachload of pensioners takes over the knobbly knees contest."], { episodes: ["Coach Party", "The Rival Camp"] }),
        show("The Copper's Beat", "drama", [50], ["(1977) A spate of burglaries leads Briggs to the last place he expected."], { episodes: ["Hot Property", "The Fence"] }),
      ],
    },
    { from: "19:00", shows: [show("Top Ten Rewind", "music", [60], ["The chart from this week in 1983, with the original performances."])] },
    {
      from: "20:00",
      shows: [
        film("The Lodgers", 1968, 100, ["A gang of crooks lodges with a little old lady who's more than a match for them."]),
        film("Night Mail to Inverness", 1979, 105, ["A sleeper train, a stolen diamond, and a guard who notices everything."]),
      ],
    },
    {
      from: "22:00",
      shows: [
        show("The Copper's Beat", "drama", [50], ["(1978) Briggs's last week before retirement is anything but quiet."], { episodes: ["Last Orders", "Handover"] }),
        show("Holiday Camp", "comedy", [30], ["End of season, and everybody's leaving except the rain."], { episodes: ["Last Night"] }),
      ],
    },
  ],
};
