export const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as yyyy-mm-dd (never via toISOString, which shifts to UTC). */
export const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (s: string, n: number) => {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};

export const todayYmd = () => ymd(new Date());

/** Epoch ms of `hour` o'clock on local date `s`. Hour 24 is the following midnight. */
export const slotTime = (s: string, hour: number) => {
  const d = parseYmd(s);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};

export const dateLabel = (
  s: string,
  opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  }
) => parseYmd(s).toLocaleDateString("en-GB", opts);

export const relativeDay = (s: string) => {
  const t = todayYmd();
  if (s === t) return "Today";
  if (s === addDays(t, 1)) return "Tomorrow";
  if (s === addDays(t, -1)) return "Yesterday";
  return dateLabel(s);
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
