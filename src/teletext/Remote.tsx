import type { Fastext } from "./pages/shared";

/** The Fastext keys: red, green, yellow and blue (shown in cyan on screen). */
const KEY_NAMES = ["Red", "Green", "Yellow", "Blue"];
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

type Props = {
  fastext: readonly Fastext[];
  onDigit: (digit: string) => void;
  onPage: (step: 1 | -1) => void;
  onSubpage: (step: 1 | -1) => void;
  /** Whether the page has subpages to turn. */
  hasSubpages: boolean;
  hold: boolean;
  onHold: () => void;
  revealed: boolean;
  onReveal: () => void;
};

/**
 * The remote control: the four coloured Fastext keys, a number pad, a D-pad
 * (up and down change page, left and right turn subpages, Hold in the
 * middle) and Reveal.
 */
export function Remote({ fastext, onDigit, onPage, onSubpage, hasSubpages, hold, onHold, revealed, onReveal }: Props) {
  return (
    <div className="remote" role="group" aria-label="Remote control">
      <ul className="remote__fastext">
        {fastext.map((f, i) => (
          <li key={i}>
            <a
              href={`#${f.page}`}
              className={`remote__colour remote__colour--${KEY_NAMES[i].toLowerCase()}`}
              aria-label={`${KEY_NAMES[i]}: ${f.label}`}
              title={f.label}
            />
          </li>
        ))}
      </ul>
      <div className="remote__keypad">
        {KEYPAD.map((digit) => (
          <button key={digit} type="button" className="remote__key" onClick={() => onDigit(digit)}>
            {digit}
          </button>
        ))}
      </div>
      <div className="remote__dpad">
        <button type="button" className="remote__key remote__key--up" aria-label="Next page" onClick={() => onPage(1)}>
          ▴
        </button>
        <button type="button" className="remote__key remote__key--left" aria-label="Previous subpage" disabled={!hasSubpages} onClick={() => onSubpage(-1)}>
          ◂
        </button>
        <button type="button" className="remote__key remote__key--hold" aria-pressed={hold} disabled={!hasSubpages} onClick={onHold}>
          Hold
        </button>
        <button type="button" className="remote__key remote__key--right" aria-label="Next subpage" disabled={!hasSubpages} onClick={() => onSubpage(1)}>
          ▸
        </button>
        <button type="button" className="remote__key remote__key--down" aria-label="Previous page" onClick={() => onPage(-1)}>
          ▾
        </button>
      </div>
      <button type="button" className="remote__key remote__key--wide" aria-pressed={revealed} onClick={onReveal}>
        Reveal
      </button>
    </div>
  );
}
