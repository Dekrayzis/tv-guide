import type { Channel } from "../types";
import { show } from "./shared";

// Brightside: comedy and entertainment

const flatSix = show("Flat Six", "comedy", [30], [
  "The flatmates throw a dinner party, and nobody can cook.",
  "Jules tries to get the deposit back; the landlord has other ideas.",
  "A power cut forces everyone to actually talk to each other.",
], { episodes: ["The Deposit", "Dinner Party", "Blackout", "The New Flatmate", "Bins"] });

const kevin = show("Kevin from Accounts", "comedy", [30], [
  "Kevin is put in charge of the office Christmas party. Nobody is pleased.",
  "An audit is coming, and Kevin has a system. Nobody understands the system.",
], { episodes: ["Away Day", "The Audit", "Secret Santa", "Hot Desking"] });

const panelBeaters = show("Panel Beaters", "comedy", [30, 45], ["Two teams of comedians, one host, and the week's news taken apart."], { alwaysNew: true });
const knowItAll = show("Know It All", "entertainment", [60], ["The quiz where one wrong answer sends your whole team home."]);
const standUp = show("Stand-Up at the Palace", "comedy", [60], ["Four comics, one legendary stage, and a host who keeps it moving."]);

export const brightside: Channel = {
  id: "brightside",
  number: 103,
  name: "Brightside",
  colour: "#f2b72c",
  category: "Entertainment",
  dayparts: [
    { from: "06:00", shows: [flatSix, kevin, show("The Allotment", "comedy", [30], ["Feuds, marrows and a scarecrow competition that gets out of hand."], { episodes: ["Marrow Escape", "Slug Wars", "First Frost"] })] },
    {
      from: "10:00",
      shows: [
        show("Fifty Fifty", "entertainment", [30, 60], ["Pairs of strangers split a prize pot, or walk away with nothing."], { alwaysNew: true }),
        show("Buzzer Beater", "entertainment", [30], ["The fastest finger quiz, with a jackpot that rolls over every day."], { alwaysNew: true }),
        knowItAll,
      ],
    },
    { from: "14:00", shows: [flatSix, kevin, show("Dinner Party Disasters", "entertainment", [60], ["Four hosts, four nights, and one score card that's going to cause trouble."])] },
    { from: "19:00", shows: [knowItAll, panelBeaters, standUp] },
    { from: "22:00", shows: [panelBeaters, standUp, flatSix, kevin] },
    { from: "01:00", shows: [flatSix, kevin, knowItAll] },
  ],
};
