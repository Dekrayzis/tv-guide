import type { Channel } from "../../data/types";
import { ChannelLogo } from "../ChannelLogo";
import { STAR, cellKey } from "./useGridNavigation";

type Props = {
  channel: Channel;
  row: number;
  favourite: boolean;
  tabStop: boolean;
  onFocus: () => void;
  onToggleFavourite: () => void;
};

/** A channel's row header: its number, logo, name and category, and a star to make it a favourite. */
export function ChannelHeader({ channel, row, favourite, tabStop, onFocus, onToggleFavourite }: Props) {
  return (
    <div role="rowheader" className="channel">
      <span className="channel__number">{channel.number}</span>
      <ChannelLogo id={channel.id} className="channel__logo" />
      <span className="channel__text">
        <span className="channel__name">{channel.name}</span>
        <span className="channel__category">
          <span className="sr-only">, </span>
          {channel.category}
        </span>
      </span>
      <button
        type="button"
        className="channel__star"
        data-cell={cellKey(row, STAR)}
        aria-pressed={favourite}
        aria-label={`Favourite ${channel.name}`}
        tabIndex={tabStop ? 0 : -1}
        onFocus={onFocus}
        onClick={onToggleFavourite}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
        </svg>
      </button>
    </div>
  );
}
