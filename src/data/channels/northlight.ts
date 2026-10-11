import type { Channel } from "../types";
import { show, film } from "./shared";

// Northlight: drama and films

const coastguard = show("Coastguard", "drama", [60], [
  "A yacht goes missing off the Lizard, and the crew's best guess is a long one.",
  "Callum's first rescue goes wrong in ways nobody trained him for.",
], { episodes: ["Mayday", "Search Pattern", "Man Overboard", "Holding Station"] });

const wardNine = show("Ward Nine", "drama", [60], [
  "A night on the ward, a heatwave, and every bed taken by midnight.",
  "Nurse Adeyemi fights for a patient the system has given up on.",
  "The consultant's mistake comes back to haunt the whole team.",
], { episodes: ["Admissions", "Triage", "The Graveyard Shift", "Discharge", "Code Blue"] });

const glasshouse = show("The Glasshouse", "drama", [60], [
  "A tech billionaire's retreat, six guests, and a body by the infinity pool.",
  "Every guest has a motive, and the lockdown makes the house smaller by the hour.",
], { episodes: ["Arrivals", "Reflections", "Cracks", "Shattered"] });

const saltmarsh = show("Saltmarsh", "drama", [60], [
  "A body on the marshes, and a village that would rather it stayed hidden.",
  "DS Rowe follows the tide charts to an alibi that doesn't add up.",
], { episodes: ["Mudflats", "The Sluice", "Samphire", "Spring Tide"] });

const films = [
  film("The Long Way North", 2019, 110, ["A widower drives his late wife's ashes to the top of Scotland, with her estranged sister in the passenger seat."]),
  film("Paper Lanterns", 2022, 100, ["Two strangers meet at a lantern festival and keep missing each other for a decade."]),
  film("Eight Miles of Rain", 2016, 95, ["A flash flood traps a commuter train, and a carriage of strangers has to work together."]),
  film("Copper Sky", 2020, 120, ["A mining town's last summer before the pit closes, seen by the kids who'll have to leave."]),
  film("Midnight at the Lido", 2023, 90, ["A swimming coach and a night guard try to save their art deco pool from the developers."]),
  film("Signal Lost", 2017, 105, ["A radio operator on a remote station hears a voice she recognises: her own."]),
  film("The Lighthouse Keeper's Daughter", 2014, 115, ["A period drama of love and shipwreck on the Northumberland coast."]),
];

export const northlight: Channel = {
  id: "northlight",
  number: 102,
  name: "Northlight",
  colour: "#3d7cf0",
  category: "Drama & film",
  dayparts: [
    { from: "06:00", shows: [coastguard, saltmarsh, wardNine] },
    { from: "12:00", shows: films },
    { from: "16:00", shows: [coastguard, wardNine, saltmarsh, glasshouse] },
    { from: "19:00", shows: [wardNine] },
    { from: "20:00", shows: [glasshouse, saltmarsh] },
    { from: "21:00", shows: films },
    { from: "23:30", shows: [...films, glasshouse] },
    { from: "02:00", shows: [coastguard, saltmarsh] },
  ],
};
