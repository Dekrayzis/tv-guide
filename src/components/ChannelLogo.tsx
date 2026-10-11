import type { ReactNode } from "react";

/** Each channel's mark, drawn on a 32 × 32 grid in the channel's colour. */
const MARKS: Record<string, ReactNode> = {
  // Signal: a broadcast dot and two arcs of signal.
  "signal-one": (
    <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
      <path d="M7 14a11 11 0 0 1 11 11" />
      <path d="M7 6a19 19 0 0 1 19 19" />
      <circle cx="9" cy="23" r="3" fill="currentColor" stroke="none" />
    </g>
  ),
  // Northlight: a four-point star.
  northlight: <path d="M16 2l3.2 10.8L30 16l-10.8 3.2L16 30l-3.2-10.8L2 16l10.8-3.2z" fill="currentColor" />,
  // Brightside: a sun.
  brightside: (
    <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <circle cx="16" cy="16" r="6.5" fill="currentColor" stroke="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="16" y1="3" x2="16" y2="6.5" transform={`rotate(${a} 16 16)`} />
      ))}
    </g>
  ),
  // Atlas: a globe.
  atlas: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="16" cy="16" r="12" />
      <ellipse cx="16" cy="16" rx="5" ry="12" />
      <path d="M4 16h24M6.5 9.5h19M6.5 22.5h19" />
    </g>
  ),
  // Pitchside: a pitch from above.
  pitchside: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="3" y="7" width="26" height="18" rx="2" />
      <path d="M16 7v18" />
      <circle cx="16" cy="16" r="4" />
    </g>
  ),
  // Tumbletime: an acorn.
  tumbletime: (
    <g fill="currentColor">
      <path d="M5 14.5c0-5.5 5-9 11-9s11 3.5 11 9z" />
      <path d="M8 16h16c0 7-3.5 12-8 13.5C11.5 28 8 23 8 16z" opacity="0.75" />
      <rect x="15" y="1.5" width="2.4" height="5" rx="1.2" />
    </g>
  ),
  // Rewind: two triangles, pointing back.
  rewind: <path d="M15 7L3 16l12 9zM29 7L17 16l12 9z" fill="currentColor" />,
  // Pulse: a heartbeat line.
  pulse: (
    <polyline
      points="2,17 9,17 12,8 16,26 20,12 23,17 30,17"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
};

export function ChannelLogo({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      {MARKS[id]}
    </svg>
  );
}
