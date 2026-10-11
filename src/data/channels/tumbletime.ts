import type { Channel } from "../types";
import { show, film } from "./shared";

// Tumbletime: children's

const acornAdventures = show("Acorn Adventures", "kids", [15], [
  "Hazel rolls through the Whispering Wood looking for the lost golden acorn.",
  "A storm blows the acorns off the old oak, and Hazel has to bring them home.",
], { episodes: ["The Golden Acorn", "Windy Day", "The Hollow Log", "Squirrel Trouble"] });

const roboRangers = show("Robo Rangers", "kids", [25], [
  "The Rangers have to stop a runaway robot vacuum before it eats the city.",
  "A mysterious signal from the moon calls the Rangers into space.",
], { episodes: ["Dust Storm", "Moonbeam", "Gear Up", "Reboot"] });

const kidsDay = [
  acornAdventures,
  roboRangers,
  show("Pip and the Puddles", "kids", [10], ["Pip finds the biggest puddle in the world. Splash!"], { episodes: ["Splash", "Rainbow", "Wellies"] }),
  show("Moon Street Bakery", "kids", [15], ["Baker Bea makes a cake for the moon's birthday."], { episodes: ["Moon Cake", "Bun Fight", "Sprinkles"] }),
  show("Dino Detectives", "kids", [25], ["Who stole the T. rex's lunchbox? The Detectives are on the case."], { episodes: ["Lunchbox Mystery", "The Missing Egg", "Volcano Day"] }),
];

export const tumbletime: Channel = {
  id: "tumbletime",
  number: 106,
  name: "Tumbletime",
  colour: "#ff6fae",
  category: "Children's",
  dayparts: [
    { from: "06:00", shows: kidsDay },
    {
      from: "16:00",
      shows: [
        roboRangers,
        show("Science Squad", "kids", [30], ["Can you make a rocket out of a fizzy drink? The Squad finds out."], { alwaysNew: true }),
        show("Treasure Island Challenge", "kids", [30], ["Two teams, one island and a chest full of prizes."]),
      ],
    },
    { from: "19:00", shows: [show("Bedtime Story", "kids", [15], ["A story read by a famous face, then it's time for bed."], { alwaysNew: true })] },
    {
      from: "19:15",
      shows: [
        film("The Snow Fox", 2021, 90, ["An animated adventure about a fox cub who follows the first snow south."]),
        film("Rocket Garden", 2019, 85, ["Two sisters build a rocket in their gran's back garden. It works."]),
      ],
    },
    { from: "21:00", shows: kidsDay },
  ],
};
