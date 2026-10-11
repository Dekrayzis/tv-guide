import type { Channel } from "../types";
import { signalOne } from "./signal-one";
import { northlight } from "./northlight";
import { brightside } from "./brightside";
import { atlas } from "./atlas";
import { pitchside } from "./pitchside";
import { tumbletime } from "./tumbletime";
import { rewind } from "./rewind";
import { pulse } from "./pulse";

/**
 * Eight made-up channels and the shows they run. Each channel's day is split
 * into dayparts (breakfast, daytime, prime time, overnight), and the
 * schedule generator fills each daypart from its own list of shows.
 */
export const CHANNELS: readonly Channel[] = [signalOne, northlight, brightside, atlas, pitchside, tumbletime, rewind, pulse];

const BY_ID = new Map(CHANNELS.map((c) => [c.id, c]));

/** A channel by its id. */
export const channelById = (id: string) => {
  const channel = BY_ID.get(id);
  if (!channel) throw new Error(`No channel "${id}"`);
  return channel;
};
