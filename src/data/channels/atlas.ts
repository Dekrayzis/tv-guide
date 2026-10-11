import type { Channel } from "../types";
import { show } from "./shared";

// Atlas: documentaries

export const atlas: Channel = {
  id: "atlas",
  number: 104,
  name: "Atlas",
  colour: "#2fb68a",
  category: "Factual",
  dayparts: [
    {
      from: "06:00",
      shows: [
        show("Wild Islands", "documentary", [60], ["Puffins, seals and a single fox on a rock in the North Atlantic.", "The machair blooms, and the whole island comes alive for six weeks."], { episodes: ["Skomer", "The Outer Hebrides", "Lundy", "Shetland"] }),
        show("Engineered", "documentary", [60], ["How a suspension bridge is built across a mile of open water.", "Inside the tunnel boring machine eating its way under London."], { episodes: ["The Bridge", "The Tunnel", "The Dam", "The Tower"] }),
        show("Ancient Roads", "documentary", [60], ["Walking the Roman road from Chester to York, and what it still tells us."], { episodes: ["Watling Street", "Fosse Way", "Ermine Street"] }),
        show("Megaships", "documentary", [60], ["Twenty thousand containers, one captain, and a storm in the Bay of Biscay."]),
      ],
    },
    {
      from: "19:00",
      shows: [
        show("Planet Unseen", "documentary", [60], ["Cameras small enough to follow a bee, and fast enough to see it think.", "What the deep ocean looks like with the lights on."], { episodes: ["Tiny Worlds", "The Deep", "Night Shift", "Underground"] }),
        show("The Hidden Kingdom", "documentary", [60], ["A year in the life of an English hedgerow, and everything that lives in it."]),
        show("Lost Cities of the Sahara", "documentary", [60, 90], ["Satellite images reveal a city the desert swallowed three thousand years ago."]),
      ],
    },
    {
      from: "23:00",
      shows: [
        show("Megaships", "documentary", [60], ["The biggest cruise ship ever built leaves the yard for the first time."]),
        show("Ancient Roads", "documentary", [60], ["Following the drovers' roads that fed London for five hundred years."], { episodes: ["Drovers", "Salt Ways"] }),
      ],
    },
  ],
};
