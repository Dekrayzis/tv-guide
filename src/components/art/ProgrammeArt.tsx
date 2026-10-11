import { memo, useId } from "react";
import type { Genre } from "../../data/types";
import { hash, seeded } from "../../lib/random";
import { H, W } from "./paint";
import { SCENES } from "./scenes";

type Props = {
  title: string;
  genre: Genre;
  tint: string;
  /** Which part of the scene to keep when it's cropped: the right (in the grid) or the middle. */
  focus?: "right" | "middle";
};

/**
 * Artwork for a programme, drawn rather than photographed: a small scene
 * for its genre (a skyline for the news, mountains for a documentary, a
 * stadium for sport...), varied by the show's title so each show keeps
 * its own picture all week, and tinted with the channel's colour.
 */
export const ProgrammeArt = memo(function ProgrammeArt({ title, genre, tint, focus = "right" }: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}${name}`;
  return (
    <svg className="art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio={focus === "right" ? "xMaxYMid slice" : "xMidYMid slice"} aria-hidden="true">
      {SCENES[genre]({ rand: seeded(hash(title)), tint, id })}
    </svg>
  );
});
