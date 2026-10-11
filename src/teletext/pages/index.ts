import { CHANNELS } from "../../data/channels";
import { channelPage } from "./channel";
import { contentsPage } from "./contents";
import { missingPage } from "./missing";
import { nowNextPage } from "./now-next";
import { quizPage } from "./quiz";
import { INDEX, NOW_NEXT, QUIZ, TODAY, TOMORROW, type Page, type Service } from "./shared";

/**
 * The teletext service: every page, built from the same listings as the
 * guide. 600 is the index, 601–608 each channel today and 611–618 tomorrow,
 * 609 is now and next, and 690 is a quiz with the answers concealed.
 */
export function buildPage(number: number, s: Service): Page {
  const count = CHANNELS.length;
  if (number === INDEX) return contentsPage();
  if (number === NOW_NEXT) return nowNextPage(s);
  if (number === QUIZ) return quizPage(s);
  if (number >= TODAY && number < TODAY + count) return channelPage(s, number - TODAY, "today");
  if (number >= TOMORROW && number < TOMORROW + count) return channelPage(s, number - TOMORROW, "tomorrow");
  return missingPage(number);
}

/** Every page in service, in order: what the up and down keys step through. */
export const PAGES_IN_SERVICE = [
  INDEX,
  ...CHANNELS.map((_, i) => TODAY + i),
  NOW_NEXT,
  ...CHANNELS.map((_, i) => TOMORROW + i),
  QUIZ,
];

export { INDEX, NOW_NEXT, type Colour, type Page } from "./shared";
