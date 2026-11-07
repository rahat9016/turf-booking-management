"use client";

import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { conflictMessage, findConflict, quote } from "@/src/lib/store";
import type { Court, TurfDB } from "@/src/types";
import type { QuickCheck } from "./types";

/** Whether `hour` × `duration` on `day` can be booked on any of `candidates`; null until a time is picked. */
export function useQuickCheck({
  db,
  day,
  hour,
  duration,
  hours,
  candidates,
  freeAt,
  now,
}: {
  db: TurfDB;
  day: string;
  hour: number;
  duration: number;
  hours: number[];
  candidates: Court[];
  /** First free court per start hour for the chosen length. */
  freeAt: Map<number, Court | undefined>;
  now: number;
}): QuickCheck | null {
  const tr = useT();
  if (!day || hour < 0 || !candidates.length) return null;
  const pick = freeAt.get(hour);
  if (pick)
    return {
      ok: true,
      court: pick,
      ...quote(pick, hour, duration, db.settings),
    };

  // The start hour may be free while a later hour of the game isn't: count how many hours do fit.
  let fits = 0;
  while (
    fits < duration - 1 &&
    candidates.some(
      (c) =>
        !findConflict(
          db,
          { courtId: c.id, date: day, startHour: hour, duration: fits + 1 },
          { now }
        )
    )
  )
    fits++;
  const conflict = findConflict(
    db,
    { courtId: candidates[0].id, date: day, startHour: hour, duration },
    { now }
  );
  const taken =
    conflict?.kind === "booking" ||
    conflict?.kind === "hold" ||
    conflict?.kind === "block";
  const message = fits
    ? tr("Only {n} hr free from {time}.", { n: fits, time: hourLabel(hour) })
    : taken
      ? tr("{time} is already taken.", { time: hourLabel(hour) })
      : conflict
        ? tr(conflictMessage(conflict))
        : "";
  // Point the visitor at the next start time that works.
  const next = hours.find((h) => h > hour && freeAt.get(h));
  return { ok: false, message, fits, next };
}
