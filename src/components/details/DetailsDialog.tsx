import { useEffect, useRef, type CSSProperties } from "react";
import { channelById } from "../../data/channels";
import { GENRES } from "../../data/genres";
import type { Programme } from "../../data/types";
import { clock, duration, isOnAt } from "../../lib/time";
import { ProgrammeArt } from "../art/ProgrammeArt";
import { Badge, onNowBadge } from "../Badge";
import { ChannelLogo } from "../ChannelLogo";
import { dayLabel } from "./dayLabel";
import { ProgrammeRow } from "./ProgrammeRow";
import { useRelatedProgrammes } from "./useRelatedProgrammes";

type Props = {
  programme: Programme | null;
  /** The days in the guide, as keys; the first is today. */
  dayKeys: readonly string[];
  /** Minutes into today's broadcast day. */
  nowMinutes: number;
  onOpen: (programme: Programme) => void;
  onClose: () => void;
};

/** Where a programme stands against the clock, if it's on today: on now (and how long is left), still to come, or over. */
function timing(programme: Programme, minutes: number | null) {
  if (minutes === null) return { live: false, status: null, progress: 0 };
  if (isOnAt(programme, minutes)) {
    const length = programme.end - programme.start;
    return {
      live: true,
      status: `${duration(Math.max(1, Math.round(programme.end - minutes)))} left`,
      progress: (minutes - programme.start) / length,
    };
  }
  if (programme.end <= minutes) return { live: false, status: "Finished", progress: 0 };
  return { live: false, status: `Starts in ${duration(Math.max(1, Math.round(programme.start - minutes)))}`, progress: 0 };
}

/**
 * A programme's details, in a modal dialog: its artwork, when it's on (and
 * how far through, if it's on now), what's after it on the channel, and
 * when else it's on this week. Esc, the close button or a click outside
 * closes it.
 */
export function DetailsDialog({ programme, dayKeys, nowMinutes, onOpen, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const related = useRelatedProgrammes(programme, dayKeys, nowMinutes);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (programme && !el.open) el.showModal();
    if (!programme && el.open) el.close();
    // Moving to another programme from inside: start reading from its title.
    else if (programme && el.open) title.current?.focus();
  }, [programme]);

  if (!programme) {
    return <dialog ref={dialog} className="details" onClose={onClose} />;
  }

  const channel = channelById(programme.channelId);
  const { live, status, progress } = timing(programme, programme.dayKey === dayKeys[0] ? nowMinutes : null);

  return (
    <dialog
      ref={dialog}
      className="details"
      aria-labelledby="details-title"
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself, not its contents.
      onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
      style={{ "--channel": channel.colour } as CSSProperties}
    >
      <article className="details__inner">
        <header className="details__hero">
          <ProgrammeArt title={programme.title} genre={programme.genre} tint={channel.colour} focus="middle" />
          <p className="details__channel">
            <ChannelLogo id={channel.id} className="details__logo" />
            {channel.name}
            <span className="details__number">{channel.number}</span>
          </p>
          <form method="dialog" className="details__close-form">
            <button type="submit" className="details__close" aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </form>
          <div className="details__heading">
            {(live || programme.isNew) && (
              <p className="details__badges">
                {live && <Badge kind={onNowBadge(programme)} />}
                {programme.isNew && <Badge kind="new" />}
              </p>
            )}
            <h2 id="details-title" ref={title} tabIndex={-1} className="details__title">
              {programme.title}
            </h2>
            {programme.seriesTag && (
              <p className="details__episode">
                <span className="details__tag">{programme.seriesTag}</span>
                {programme.episode}
              </p>
            )}
          </div>
        </header>

        <div className="details__body">
          <div className="details__when">
            <p className="details__time">
              <span>{dayLabel(programme.dayKey, dayKeys)}</span>
              <span>
                {clock(programme.start)} – {clock(programme.end)}
              </span>
              <span className="details__length">{duration(programme.end - programme.start)}</span>
            </p>
            {status && <p className={live ? "details__status is-live" : "details__status"}>{status}</p>}
            {live && (
              <progress className="details__progress" max={1} value={progress}>
                {Math.round(progress * 100)}% through
              </progress>
            )}
          </div>

          <p className="details__blurb">{programme.blurb}</p>

          <ul className="details__chips" aria-label="About this programme">
            <li className="chip chip--genre">{GENRES[programme.genre]}</li>
            {programme.series && <li className="chip">{programme.series}</li>}
            {programme.subtitles && (
              <li className="chip">
                <abbr title="Subtitles">S</abbr> Subtitles
              </li>
            )}
            {programme.audioDescribed && (
              <li className="chip">
                <abbr title="Audio description">AD</abbr> Audio described
              </li>
            )}
          </ul>

          {related.next.length > 0 && (
            <section className="details__section" aria-labelledby="details-next">
              <h3 id="details-next" className="details__subhead">
                Next on {channel.name}
              </h3>
              <ol className="details__list">
                {related.next.map((p) => (
                  <ProgrammeRow key={p.id} programme={p} onOpen={onOpen} />
                ))}
              </ol>
            </section>
          )}

          {related.others.length > 0 && (
            <section className="details__section" aria-labelledby="details-other">
              <h3 id="details-other" className="details__subhead">
                Also showing this week
              </h3>
              <ul className="details__list">
                {related.others.map((p) => (
                  <ProgrammeRow key={p.id} programme={p} day={dayLabel(p.dayKey, dayKeys)} onOpen={onOpen} />
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </dialog>
  );
}
