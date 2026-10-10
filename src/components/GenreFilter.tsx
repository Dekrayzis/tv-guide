import { GENRES, GENRE_IDS } from "../data/genres";
import type { Genre } from "../data/types";

type Props = {
  value: ReadonlySet<Genre>;
  onChange: (genres: ReadonlySet<Genre>) => void;
};

/** Genres to highlight. With none ticked, everything shows at full strength. */
export function GenreFilter({ value, onChange }: Props) {
  const toggle = (genre: Genre) => {
    const next = new Set(value);
    if (!next.delete(genre)) next.add(genre);
    onChange(next);
  };

  return (
    <fieldset className="genres">
      <legend className="genres__legend">Highlight</legend>
      <div className="genres__list">
        {GENRE_IDS.map((genre) => (
          <label key={genre} className="genres__chip">
            <input type="checkbox" className="genres__input" checked={value.has(genre)} onChange={() => toggle(genre)} />
            {GENRES[genre]}
          </label>
        ))}
      </div>
      {value.size > 0 && (
        <button type="button" className="genres__clear" onClick={() => onChange(new Set())}>
          Clear
        </button>
      )}
    </fieldset>
  );
}
