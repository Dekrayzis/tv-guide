import { CHANNELS } from "../../data/channels";
import { hash, pick, seeded } from "../../lib/random";
import { inPrimeTime } from "../../lib/time";
import { GENERAL_FASTEXT, tt, type Page, type Service } from "./shared";

const QUESTIONS = 4;

/**
 * 690: four questions about tonight's listings, different every day. The
 * answers are concealed until Reveal is pressed.
 */
export function quizPage(s: Service): Page {
  const rand = seeded(hash(`quiz:${s.todayKey}`));
  const pool = [...CHANNELS];
  const questions = Array.from({ length: QUESTIONS }, (_, n) => {
    const channel = pool.splice(Math.floor(rand() * pool.length), 1)[0];
    const list = s.today.get(channel.id) ?? [];
    const prime = list.filter((p) => inPrimeTime(p.start));
    const p = pick(rand, prime.length ? prime : list);
    return n % 2 === 0
      ? { q: `What time does ${p.title} start on ${channel.name} tonight?`, a: tt(p.start) }
      : { q: `What's on ${channel.name} at ${tt(p.start)} tonight?`, a: p.title };
  });

  return {
    title: "TV quiz",
    colour: "magenta",
    info: "Press Reveal to see the answers",
    subpages: [
      <ol key="quiz" className="tt-quiz">
        {questions.map(({ q, a }, n) => (
          <li key={n}>
            <p className="tt-quiz__q">
              <span className="tt-yellow">{n + 1}</span> {q}
            </p>
            <p className="tt-quiz__a">
              Answer: <span className="tt-conceal">{a}</span>
            </p>
          </li>
        ))}
      </ol>,
    ],
    fastext: GENERAL_FASTEXT,
  };
}
