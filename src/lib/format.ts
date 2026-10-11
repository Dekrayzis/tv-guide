/** The date and time formats the guide shows, in British English. */

/** "Sunday 11 October". */
export const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

/** "11 Oct". */
export const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

/** "Sun 11 Oct". */
export const dayAndDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

/** "Sun". */
export const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" });

/** "21:30". */
export const clockTime = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
