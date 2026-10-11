import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { CHANNELS } from "../data/channels";
import { GENRES } from "../data/genres";
import { scheduleFor } from "../data/schedule";
import type { Programme } from "../data/types";
import { clock, duration } from "../lib/time";
import { ChannelLogo } from "./ChannelLogo";
import { ProgrammeArt } from "./ProgrammeArt";

const shortDay = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

/** "2026-10-13" as a date. */
const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

type Props = {
  programme: Programme | null;
  /** The days in the guide, as keys; the first is today. */
  dayKeys: readonly string[];
  /** Minutes into today's broadcast day. */
  nowMinutes: number;
  onOpen: (programme: Programme) => void;
  onClose: () => void;
};

/**
 * A programme's details, in a modal dialog: its artwork, when it's on (and
 * how far through, if it's on now), what's after it on the channel, and
 * when else it's on this week. Esc, the close button or a click outside
 * closes it.
 */
export function DetailsDialog({ programme, dayKeys, nowMinutes, onOpen, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (programme && !el.open) el.showModal();
    if (!programme && el.open) el.close();
    // Moving to another programme from inside: start reading from its title.
    else if (programme && el.open) title.current?.focus();
  }, [programme]);

  const channel = programme && CHANNELS.find((c) => c.id === programme.channelId);

  const dayName = (key: string) => (key === dayKeys[0] ? "Today" : key === dayKeys[1] ? "Tomorrow" : shortDay.format(fromKey(key)));
  // Where a programme stands against the clock: minutes into it, or null when it isn't today.
  const onToday = (p: Programme) => (p.dayKey === dayKeys[0] ? nowMinutes : null);

  const { comingUp, otherShowings } = useMemo(() => {
    if (!programme) return { comingUp: [], otherShowings: [] };
    const day = scheduleFor(CHANNELS.find((c) => c.id === programme.channelId)!, programme.dayKey);
    const after = day.filter((p) => p.start >= programme.end).slice(0, 3);
    // The same show anywhere else this week, from now on.
    const others = dayKeys
      .flatMap((key) => CHANNELS.flatMap((c) => scheduleFor(c, key)))
      .filter((p) => p.title === programme.title && p.id !== programme.id && !after.includes(p))
      .filter((p) => p.dayKey !== dayKeys[0] || p.end > nowMinutes)
      .slice(0, 4);
    return { comingUp: after, otherShowings: others };
  }, [programme, dayKeys]);

  if (!programme || !channel) {
    return <dialog ref={dialog} className="details" onClose={onClose} />;
  }

  const minutes = onToday(programme);
  const length = programme.end - programme.start;
  const live = minutes !== null && programme.start <= minutes && minutes < programme.end;
  const finished = minutes !== null && programme.end <= minutes;
  const progress = live ? (minutes - programme.start) / length : 0;
  const liveEvent = programme.title.startsWith("Live:");

  let status: string | null = null;
  if (live) status = `${duration(Math.max(1, Math.round(programme.end - minutes)))} left`;
  else if (finished) status = "Finished";
  else if (minutes !== null) status = `Starts in ${duration(Math.max(1, Math.round(programme.start - minutes)))}`;

  const row = (p: Programme, showChannel: boolean) => {
    const c = CHANNELS.find((ch) => ch.id === p.channelId)!;
    return (
      <li key={p.id}>
        <button type="button" className="details__item" onClick={() => onOpen(p)} style={{ "--channel": c.colour } as CSSProperties}>
          <span className="details__item-art">
            <ProgrammeArt title={p.title} genre={p.genre} tint={c.colour} focus="middle" />
          </span>
          <span className="details__item-text">
            <span className="details__item-title">{p.title}</span>
            <span className="details__item-when">
              {showChannel && `${dayName(p.dayKey)} · `}
              {clock(p.start)}
              {showChannel && ` · ${c.name}`}
            </span>
          </span>
        </button>
      </li>
    );
  };

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
                {live && <span className={liveEvent ? "badge badge--live" : "badge badge--now"}>{liveEvent ? "Live" : "On now"}</span>}
                {programme.isNew && <span className="badge">New</span>}
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
              <span>{dayName(programme.dayKey)}</span>
              <span>
                {clock(programme.start)} – {clock(programme.end)}
              </span>
              <span className="details__length">{duration(length)}</span>
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

          {comingUp.length > 0 && (
            <section className="details__section" aria-labelledby="details-next">
              <h3 id="details-next" className="details__subhead">
                Next on {channel.name}
              </h3>
              <ol className="details__list">{comingUp.map((p) => row(p, false))}</ol>
            </section>
          )}

          {otherShowings.length > 0 && (
            <section className="details__section" aria-labelledby="details-other">
              <h3 id="details-other" className="details__subhead">
                Also showing this week
              </h3>
              <ul className="details__list">{otherShowings.map((p) => row(p, true))}</ul>
            </section>
          )}
        </div>
      </article>
    </dialog>
  );
}
