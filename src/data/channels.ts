import type { Channel, Genre, Show } from "./types";

/**
 * Eight made-up channels and the shows they run. Each channel's day is split
 * into dayparts (breakfast, daytime, prime time, overnight), and the
 * schedule generator fills each daypart from its own list of shows.
 */

const show = (title: string, genre: Genre, durations: number[], blurbs: string[], extra: Partial<Show> = {}): Show => ({
  title,
  genre,
  durations,
  blurbs,
  ...extra,
});

const film = (title: string, year: number, minutes: number, blurbs: string[]) =>
  show(title, "film", [minutes], blurbs.map((b) => `(${year}) ${b}`));

// ---- Shared: news ------------------------------------------------------------

const bulletin = (title: string, minutes: number) =>
  show(title, "news", [minutes], ["The latest national and international news, with sport and the weather."], { alwaysNew: true });

// ---- Signal One: the flagship ------------------------------------------------

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

const signalOne: Channel = {
  id: "signal-one",
  number: 101,
  name: "Signal One",
  mark: "S1",
  colour: "#e8463a",
  tagline: "News, drama and the big Saturday night.",
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

// ---- Northlight: drama and films ---------------------------------------------

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

const northlight: Channel = {
  id: "northlight",
  number: 102,
  name: "Northlight",
  mark: "NL",
  colour: "#3d7cf0",
  tagline: "Drama after dark, and a film every night.",
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

// ---- Brightside: comedy and entertainment ------------------------------------

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

const brightside: Channel = {
  id: "brightside",
  number: 103,
  name: "Brightside",
  mark: "BS",
  colour: "#f2b72c",
  tagline: "Comedy, quizzes and the shows everyone's talking about.",
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

// ---- Atlas: documentaries ----------------------------------------------------

const atlas: Channel = {
  id: "atlas",
  number: 104,
  name: "Atlas",
  mark: "AT",
  colour: "#2fb68a",
  tagline: "The planet, the past and how things work.",
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

// ---- Pitchside: sport --------------------------------------------------------

const classicMatches = show("Classic Matches", "sport", [90, 120], ["A cup final that went to penalties, shown in full.", "The 1990s league decider, with the original commentary."]);

const pitchside: Channel = {
  id: "pitchside",
  number: 105,
  name: "Pitchside",
  mark: "PS",
  colour: "#7cc242",
  tagline: "Live sport, highlights and the debate after.",
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
        show("Live: Snooker, Northern Masters", "sport", [180, 240], ["The afternoon session from the Crucible of the North."], { alwaysNew: true }),
        show("Live: Cycling, Tour of the Dales", "sport", [180], ["Stage four: 180 kilometres and three categorised climbs."], { alwaysNew: true }),
      ],
    },
    { from: "17:00", shows: [show("Pitchside Tonight", "sport", [60], ["The day's results, the build-up and the team news."], { alwaysNew: true })] },
    { from: "18:00", shows: [classicMatches, show("Rugby: Premiership Rewind", "sport", [90], ["Every try from the weekend's round of matches."])] },
    {
      from: "19:30",
      shows: [
        show("Live: Football, Super League", "sport", [120], ["Top of the table meets bottom, and nothing is settled."], { alwaysNew: true }),
        show("Live: Darts, Premier Arrows", "sport", [180], ["Eight players, one night, and the nine-darter bonus is still up for grabs."], { alwaysNew: true }),
      ],
    },
    { from: "22:30", shows: [show("Match of the Night", "sport", [75], ["Every goal from tonight's games, and the arguments about them."], { alwaysNew: true })] },
    { from: "23:45", shows: [show("The Debate", "sport", [60], ["Three pundits, one table, no agreement."], { alwaysNew: true }), classicMatches] },
  ],
};

// ---- Tumbletime: children's ---------------------------------------------------

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

const tumbletime: Channel = {
  id: "tumbletime",
  number: 106,
  name: "Tumbletime",
  mark: "TT",
  colour: "#ff6fae",
  tagline: "Cartoons and stories from sunrise to bedtime.",
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

// ---- Rewind: classic television ----------------------------------------------

const rewind: Channel = {
  id: "rewind",
  number: 107,
  name: "Rewind",
  mark: "RW",
  colour: "#b48cff",
  tagline: "The best of British telly, again.",
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

// ---- Pulse: music and gaming -------------------------------------------------

const patchNotes = show("Patch Notes", "gaming", [30], ["This week's game news, releases and the update that broke everything."], { alwaysNew: true });

const pulse: Channel = {
  id: "pulse",
  number: 108,
  name: "Pulse",
  mark: "PL",
  colour: "#14c4dc",
  tagline: "Music videos, live sets and games culture.",
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

export const CHANNELS: readonly Channel[] = [signalOne, northlight, brightside, atlas, pitchside, tumbletime, rewind, pulse];
