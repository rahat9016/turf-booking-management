import { pad } from "./date";

export const hourLabel = (h: number) => {
  const hh = h % 24;
  const suffix = hh < 12 ? "AM" : "PM";
  return `${hh % 12 === 0 ? 12 : hh % 12} ${suffix}`;
};

export const hourShort = (h: number) => {
  const hh = h % 24;
  return `${hh % 12 === 0 ? 12 : hh % 12}${hh < 12 ? "a" : "p"}`;
};

export const rangeLabel = (start: number, duration: number) =>
  `${hourLabel(start)} – ${hourLabel(start + duration)}`;

/** "2:00 PM" — hours shown with minutes, as on a match ticket. */
export const clock = (h: number) => {
  const hh = h % 24;
  return `${hh % 12 === 0 ? 12 : hh % 12}:00 ${hh < 12 ? "AM" : "PM"}`;
};

/** "2:00 – 3:00 PM", or "11:00 AM – 1:00 PM" when it crosses noon. */
export const clockRange = (a: number, b: number) => {
  const [x, y] = [clock(a), clock(b)];
  return x.slice(-2) === y.slice(-2)
    ? `${x.slice(0, -3)} – ${y}`
    : `${x} – ${y}`;
};

/** "12m", "1h 05m" — for countdowns. */
export const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}h ${pad(m)}m`;
  if (m >= 10) return `${m}m`;
  return `${m}:${pad(s)}`;
};

/** "just now", "5m", "3h", "2d" — how long ago `iso` was, from `now` (ms). */
export const timeAgo = (iso: string, now: number) => {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86_400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86_400)}d`;
};
