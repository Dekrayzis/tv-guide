import { GENRES, GENRE_IDS } from "../data/genres";
import type { Genre } from "../data/types";
import { toggled } from "../lib/sets";

type Props = {
  value: ReadonlySet<Genre>;
  onChange: (genres: ReadonlySet<Genre>) => void;
};

/** Genres to highlight; any number at once. "All" clears them, so everything shows at full strength. */
export function GenreFilter({ value, onChange }: Props) {
  return (
    <fieldset className="genres">
      <legend className="sr-only">Highlight genres</legend>
      <button type="button" className="genres__chip genres__all" aria-pressed={value.size === 0} onClick={() => onChange(new Set())}>
        All
      </button>
      {GENRE_IDS.map((genre) => (
        <label key={genre} className="genres__chip">
          <input type="checkbox" className="genres__input" checked={value.has(genre)} onChange={() => onChange(toggled(value, genre))} />
          {GENRES[genre]}
        </label>
      ))}
    </fieldset>
  );
}
