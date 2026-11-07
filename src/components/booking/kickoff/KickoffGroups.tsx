"use client";

import { KickoffCell } from "@/src/components/common";
import { useT } from "@/src/lib/i18n";
import { isPickable, slotInfo, useTurfDB } from "@/src/lib/store";
import type { Court } from "@/src/types";
import { takenNote } from "./cellStyles";

/** Upcoming kick-off times for one ground, split into daytime and evening (peak) groups. */
export function KickoffGroups({
  court,
  day,
  hours,
  now,
  clientId,
  start,
  duration,
  onPick,
}: {
  court: Court;
  day: string;
  /** Start hours still ahead. */
  hours: number[];
  now: number;
  clientId: string;
  start: number | null;
  duration: number;
  onPick: (h: number) => void;
}) {
  const tr = useT();
  const db = useTurfDB();
  const { peakStartHour } = db.settings;
  const groups = [
    {
      label: tr("Morning & Afternoon"),
      hs: hours.filter((h) => h < peakStartHour),
    },
    { label: tr("Evening"), hs: hours.filter((h) => h >= peakStartHour) },
  ];
  return groups.map(
    (g) =>
      g.hs.length > 0 && (
        <div key={g.label} className="mt-5">
          <p className="mb-2.5 text-sm font-semibold text-neutral-800">
            {g.label}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-7">
            {g.hs.map((h) => {
              const info = slotInfo(db, court, day, h, now, clientId);
              const open = isPickable(info);
              return (
                <KickoffCell
                  key={h}
                  hour={h}
                  open={open}
                  selected={
                    start !== null && h >= start && h < start + duration
                  }
                  note={tr(open ? "Available" : takenNote(info))}
                  onPick={onPick}
                  className="py-3 sm:px-2"
                />
              );
            })}
          </div>
        </div>
      )
  );
}
