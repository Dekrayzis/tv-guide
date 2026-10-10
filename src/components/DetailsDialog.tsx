import { useEffect, useRef, type CSSProperties } from "react";
import { CHANNELS } from "../data/channels";
import { GENRES } from "../data/genres";
import type { Programme } from "../data/types";
import { clock, duration } from "../lib/time";

type Props = {
  programme: Programme | null;
  nowMinutes: number | null;
  onClose: () => void;
};

/** A programme's details, in a modal dialog. Esc, the Close button or a click outside closes it. */
export function DetailsDialog({ programme, nowMinutes, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (programme && !el.open) el.showModal();
    if (!programme && el.open) el.close();
  }, [programme]);

  const channel = programme && CHANNELS.find((c) => c.id === programme.channelId);
  const live = programme && nowMinutes !== null && programme.start <= nowMinutes && nowMinutes < programme.end;
  const progress = live ? (nowMinutes! - programme.start) / (programme.end - programme.start) : 0;

  return (
    <dialog
      ref={dialog}
      className="details"
      aria-labelledby="details-title"
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself, not its contents.
      onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
      style={{ "--channel": channel?.colour } as CSSProperties}
    >
      {programme && channel && (
        <div className="details__inner">
          <header className="details__head">
            <p className="details__channel">
              <span className="channel__mark" aria-hidden="true">
                {channel.mark}
              </span>
              {channel.name} <span className="details__number">{channel.number}</span>
            </p>
            <h2 id="details-title" className="details__title">
              {programme.title}
            </h2>
            {programme.episode && <p className="details__episode">{programme.episode}</p>}
          </header>

          <p className="details__when">
            {clock(programme.start)} – {clock(programme.end)}
            <span className="details__length">{duration(programme.end - programme.start)}</span>
          </p>

          {live && (
            <p className="details__live">
              On now
              <progress className="details__progress" max={1} value={progress}>
                {Math.round(progress * 100)}% through
              </progress>
            </p>
          )}

          <p className="details__blurb">{programme.blurb}</p>

          <dl className="details__facts">
            <div>
              <dt>Genre</dt>
              <dd>{GENRES[programme.genre]}</dd>
            </div>
            {programme.series && (
              <div>
                <dt>Episode</dt>
                <dd>{programme.series}</dd>
              </div>
            )}
          </dl>

          <ul className="details__flags" aria-label="Access and status">
            {programme.isNew && <li className="details__flag details__flag--new">New</li>}
            {programme.subtitles && (
              <li className="details__flag">
                <abbr title="Subtitles">S</abbr>
              </li>
            )}
            {programme.audioDescribed && (
              <li className="details__flag">
                <abbr title="Audio description">AD</abbr>
              </li>
            )}
          </ul>

          <form method="dialog" className="details__actions">
            <button type="submit" className="details__close">
              Close
            </button>
          </form>
        </div>
      )}
    </dialog>
  );
}
