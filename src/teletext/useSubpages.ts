import { useEffect, useState } from "react";

/** How long a subpage stays up before the next turns over. */
const ROTATE_MS = 12_000;

/**
 * A page's subpages, turning over by themselves every twelve seconds until
 * Hold is pressed. Changing page starts the new one at `startAt`.
 */
export function useSubpages(page: number, count: number, startAt = 0) {
  const [sub, setSub] = useState({ page, index: startAt });
  const [hold, setHold] = useState(false);
  const index = sub.page === page ? Math.min(sub.index, count - 1) : startAt;

  const turn = (step: number) => setSub({ page, index: (index + step + count) % count });

  // Re-armed whenever the subpage changes, so a manual turn gets its full twelve seconds too.
  useEffect(() => {
    if (hold || count < 2) return;
    const id = setTimeout(() => setSub({ page, index: (index + 1) % count }), ROTATE_MS);
    return () => clearTimeout(id);
  }, [page, index, count, hold]);

  return { index, count, turn, hold, setHold };
}
