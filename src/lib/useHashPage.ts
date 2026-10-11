import { useCallback, useEffect, useState } from "react";

/** A teletext page number in the URL hash ("#601"), or null for the guide. */
const read = () => {
  const match = /^#(\d{3})$/.exec(location.hash);
  return match ? Number(match[1]) : null;
};

/**
 * The teletext page in the address bar. Pages are real URLs, so links to
 * them work, and Back steps through the pages you've visited.
 */
export function useHashPage() {
  const [page, setPage] = useState(read);

  useEffect(() => {
    const sync = () => setPage(read());
    addEventListener("hashchange", sync);
    addEventListener("popstate", sync);
    return () => {
      removeEventListener("hashchange", sync);
      removeEventListener("popstate", sync);
    };
  }, []);

  const go = useCallback((next: number | null) => {
    if (next !== null) {
      location.hash = String(next);
      return;
    }
    // Back to the guide: drop the hash entirely rather than leave a bare "#".
    history.pushState(null, "", location.pathname + location.search);
    setPage(null);
  }, []);

  return [page, go] as const;
}
