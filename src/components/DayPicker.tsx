import { longDate, shortDate, weekday } from "../lib/format";

type Props = {
  days: readonly Date[];
  value: number;
  onChange: (index: number) => void;
};

/** The week ahead, as a set of radio buttons: one day on show at a time. */
export function DayPicker({ days, value, onChange }: Props) {
  return (
    <fieldset className="days">
      <legend className="sr-only">Day</legend>
      {days.map((day, i) => (
        <label key={i} className="days__day">
          <input type="radio" name="day" className="days__input" checked={value === i} onChange={() => onChange(i)} />
          <span className="days__name">{i === 0 ? "Today" : weekday.format(day)}</span>
          <span className="days__date" aria-hidden="true">
            {shortDate.format(day)}
          </span>
          <span className="sr-only">, {longDate.format(day)}</span>
        </label>
      ))}
    </fieldset>
  );
}
