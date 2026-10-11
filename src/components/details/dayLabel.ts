import { dayAndDate } from "../../lib/format";
import { dateFromKey } from "../../lib/time";

/** A day as people say it: "Today", "Tomorrow", or "Tue 13 Oct". `dayKeys` starts with today. */
export const dayLabel = (key: string, dayKeys: readonly string[]) =>
  key === dayKeys[0] ? "Today" : key === dayKeys[1] ? "Tomorrow" : dayAndDate.format(dateFromKey(key));
