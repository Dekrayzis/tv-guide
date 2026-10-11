import type { Channel } from "../types";
import { show, film, bulletin } from "./shared";

// Signal One: the flagship

const harbourStreet = show("Harbour Street", "drama", [30], [
  "Tensions rise at the Anchor when an old face walks back through the door.",
  "Priya makes a decision that could cost her the café.",
  "The street rallies round after a fire at the chandlery.",
  "Dom's secret is out, and the whole street knows by lunchtime.",
], { episodes: ["Low Tide", "The Anchor", "Smoke on the Water", "Moorings", "All Hands", "Shore Leave"] });

const lineOfInquiry = show("Line of Inquiry", "drama", [60], [
  "DI Okafor reopens a cold case when a familiar signature turns up at a new scene.",
  "A missing courier, a burnt-out van and a witness who won't talk.",
  "The team is split when evidence points to one of their own.",
], { episodes: ["The Long Count", "Paper Trail", "Blind Spot", "Chain of Custody", "Exhibit A"] });

const tidewater = show("Tidewater", "drama", [60], [
  "A storm cuts the island off, and the Pengellys' past comes in with the tide.",
  "Morwenna finds a letter that rewrites everything she knew about her father.",
  "The lifeboat is called out on the worst night of the year.",
], { episodes: ["Spring Tide", "The Undertow", "Wreckers", "High Water"] });

const provingGround = show("Proving Ground", "entertainment", [60, 75], [
  "Twelve home bakers, one tent, and a showstopper that has to stand up on its own.",
  "Bread week: the judges want an open crumb and a plaited loaf with six strands.",
  "It's the semi-final, and the technical is something nobody has heard of.",
], { episodes: ["Cake Week", "Bread Week", "Pastry Week", "Semi-final", "The Final"] });

export const signalOne: Channel = {
  id: "signal-one",
  number: 101,
  name: "Signal One",
  colour: "#e8463a",
  category: "News & drama",
  dayparts: [
    { from: "06:00", shows: [show("Signal Breakfast", "news", [180], ["News, sport, weather and the day's talking points from the sofa."], { alwaysNew: true })] },
    {
      from: "09:00",
      shows: [
        show("The Attic Detectives", "lifestyle", [45, 60], ["Two experts dig through a family's loft for anything worth taking to auction.", "A biscuit tin of war medals turns out to have a remarkable story."]),
        show("Homes Under the Gavel", "lifestyle", [60], ["Three properties go under the hammer, and three buyers learn what they've really bought."]),
        show("The Morning Table", "entertainment", [60], ["Chat, cooking and a guest who has something to plug."], { alwaysNew: true }),
        show("Doctors' Row", "drama", [30], ["Dr Hale treats a patient who knows more about her past than he should.", "A routine check-up uncovers more than a bad back."], { episodes: ["House Calls", "Second Opinion", "Bedside Manner"] }),
      ],
    },
    { from: "13:00", shows: [bulletin("Signal News at One", 30)] },
    {
      from: "13:30",
      shows: [
        show("Escape to the Allotment", "lifestyle", [45, 60], ["A family swaps their patio for half an acre and a shed with ambitions."]),
        show("Brainstorm", "entertainment", [45], ["Four contestants, one buzzer each, and the questions get harder every round."], { alwaysNew: true }),
        show("Doctors' Row", "drama", [30], ["Dr Hale's locum has a very different way of doing things."], { episodes: ["Locum", "Night Shift"] }),
      ],
    },
    { from: "18:00", shows: [bulletin("Signal News at Six", 30)] },
    { from: "18:30", shows: [show("Around Here", "news", [30], ["News, sport and weather from where you are."], { alwaysNew: true })] },
    { from: "19:00", shows: [harbourStreet] },
    { from: "19:30", shows: [provingGround, lineOfInquiry, tidewater] },
    { from: "22:00", shows: [bulletin("Signal News at Ten", 30)] },
    {
      from: "22:30",
      shows: [
        show("Late Edition", "entertainment", [45, 60], ["Guests from film, music and politics round the table, and a band to finish."], { alwaysNew: true }),
        film("Glass Harbour", 2021, 105, ["A harbourmaster's daughter uncovers a smuggling ring hiding in plain sight."]),
        film("The Quiet Engine", 2018, 95, ["A retired train driver takes one last journey across the Highlands."]),
      ],
    },
    { from: "01:00", shows: [show("Overnight News", "news", [60], ["Rolling news through the night, with the papers at the top of each hour."], { alwaysNew: true })] },
  ],
};
