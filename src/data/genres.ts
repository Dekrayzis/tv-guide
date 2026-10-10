import type { Genre } from "./types";

/** Genre names as the guide shows them, in the order the filters list them. */
export const GENRES: Record<Genre, string> = {
  news: "News",
  drama: "Drama",
  comedy: "Comedy",
  entertainment: "Entertainment",
  documentary: "Documentary",
  film: "Film",
  sport: "Sport",
  kids: "Children's",
  lifestyle: "Lifestyle",
  music: "Music",
  gaming: "Gaming",
};

export const GENRE_IDS = Object.keys(GENRES) as Genre[];
