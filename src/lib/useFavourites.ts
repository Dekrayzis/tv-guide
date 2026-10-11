import { useState } from "react";
import { toggled } from "./sets";

const KEY = "signal:favourites";

const load = (): string[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

/** Favourite channels, kept in this browser. */
export function useFavourites() {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(load()));

  const toggle = (id: string) => {
    const next = toggled(ids, id);
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      // Storage can be off (private windows): favourites then last the visit.
    }
  };

  return [ids, toggle] as const;
}
