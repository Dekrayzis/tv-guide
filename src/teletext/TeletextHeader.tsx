import { useNow } from "../lib/useNow";

const headerDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short" });
const two = (n: number) => String(n).padStart(2, "0");

type Props = {
  /** The page asked for, or the digits typed so far ("6--"). */
  target: string;
  /** The rolling counter's number. */
  counter: number;
};

/** Row 0: the page asked for, the service, the rolling counter, the date and a clock with seconds. It ticks on its own. */
export function TeletextHeader({ target, counter }: Props) {
  const now = useNow(1000);
  return (
    <p className="tt-header">
      <span>P{target}</span>
      <span>SIGNAL</span>
      <span aria-hidden="true">{counter}</span>
      <span>{headerDate.format(now).replace(",", "")}</span>
      <time className="tt-yellow" dateTime={now.toISOString()}>
        {two(now.getHours())}:{two(now.getMinutes())}/{two(now.getSeconds())}
      </time>
    </p>
  );
}
