import { useLayoutEffect, useRef } from "react";

/**
 * The page is laid out 40 characters wide in its own font, then stretched
 * sideways to fill the screen: this keeps the stretch (`--sx`) right as the
 * screen resizes, and when the pixel font arrives and changes the page's width.
 */
export function usePageFit() {
  const screen = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fit = () => {
      if (screen.current && sheet.current) {
        sheet.current.style.setProperty("--sx", String(screen.current.clientWidth / sheet.current.offsetWidth));
      }
    };
    const observer = new ResizeObserver(fit);
    observer.observe(screen.current!);
    observer.observe(sheet.current!);
    return () => observer.disconnect();
  }, []);

  return { screen, sheet };
}
