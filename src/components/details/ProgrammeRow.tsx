import type { CSSProperties } from "react";
import { channelById } from "../../data/channels";
import type { Programme } from "../../data/types";
import { clock } from "../../lib/time";
import { ProgrammeArt } from "../art/ProgrammeArt";

type Props = {
  programme: Programme;
  /** The day it's on ("Tomorrow"), for showings on other days and channels; omitted for what's next. */
  day?: string;
  onOpen: (programme: Programme) => void;
};

/** Another programme, in the details dialog: a thumbnail of its art, its title and when it's on. */
export function ProgrammeRow({ programme: p, day, onOpen }: Props) {
  const channel = channelById(p.channelId);
  return (
    <li>
      <button type="button" className="details__item" onClick={() => onOpen(p)} style={{ "--channel": channel.colour } as CSSProperties}>
        <span className="details__item-art">
          <ProgrammeArt title={p.title} genre={p.genre} tint={channel.colour} focus="middle" />
        </span>
        <span className="details__item-text">
          <span className="details__item-title">{p.title}</span>
          <span className="details__item-when">{day ? `${day} · ${clock(p.start)} · ${channel.name}` : clock(p.start)}</span>
        </span>
      </button>
    </li>
  );
}
