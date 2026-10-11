import { useEffect, useEffectEvent } from "react";

type Keys = {
  digit: (digit: string) => void;
  /** Esc: forget a half-typed page number. */
  cancel: () => void;
  /** Up and down: +1 for the next page, -1 for the previous. */
  page: (step: 1 | -1) => void;
  /** Left and right: +1 for the next subpage, -1 for the previous. */
  subpage: (step: 1 | -1) => void;
};

/**
 * The keyboard as a remote: digits anywhere enter a page number, the arrows
 * change page and subpage. Keys typed into a form field are left alone.
 */
export function useRemoteKeys(keys: Keys) {
  // An effect event always sees the latest handlers, so the listener is added once.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return;
    if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
    if (/^\d$/.test(event.key)) keys.digit(event.key);
    else if (event.key === "Escape") keys.cancel();
    else if (event.key === "ArrowUp" || event.key === "ArrowDown") keys.page(event.key === "ArrowUp" ? 1 : -1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") keys.subpage(event.key === "ArrowRight" ? 1 : -1);
    else return;
    event.preventDefault();
  });

  useEffect(() => {
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
}
