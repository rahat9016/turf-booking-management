"use client";

import { SportIcon } from "@/src/components/common";
import { dateLabel, hourLabel, hourShort } from "@/src/lib/format";
import { hoursOf, isPickable, slotInfo, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Court, SlotSelection } from "@/src/types";
import { cellNote, cellTone } from "./cellStyles";

/** Courts × hours grid for one day — the whole venue's schedule at a glance. */
export function CourtMatrix({
  day,
  now,
  clientId,
  selection,
  onPick,
}: {
  day: string;
  now: number;
  clientId: string;
  selection: SlotSelection | null;
  onPick: (c: Court, h: number) => void;
}) {
  const db = useTurfDB();
  const courts = db.courts.filter((c) => c.active);
  const hours = hoursOf(db.settings);
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-neutral-900">
          {dateLabel(day, { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-32 bg-white" />
              {hours.map((h) => (
                <th
                  key={h}
                  className={cn(
                    "min-w-8 text-[10px] font-medium",
                    h >= db.settings.peakStartHour
                      ? "text-orange-600"
                      : "text-neutral-500"
                  )}
                >
                  {hourShort(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courts.map((c) => (
              <tr key={c.id}>
                <th className="sticky left-0 z-10 bg-white pr-2 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-800">
                    <SportIcon
                      sport={c.sport}
                      className="size-3.5 text-emerald-700"
                    />
                    <span className="truncate">{c.name}</span>
                  </span>
                </th>
                {hours.map((h) => {
                  const info = slotInfo(db, c, day, h, now, clientId);
                  const selected =
                    !!selection &&
                    selection.courtId === c.id &&
                    h >= selection.startHour &&
                    h < selection.startHour + selection.duration;
                  return (
                    <td key={h} className="p-0">
                      <button
                        disabled={!isPickable(info)}
                        onClick={() => onPick(c, h)}
                        title={`${c.name} · ${hourLabel(h)} · ${cellNote(info)}`}
                        aria-label={`${c.name} ${hourLabel(h)} ${cellNote(info)}`}
                        className={cn(
                          "block h-9 w-full rounded-md ring-1 transition disabled:cursor-not-allowed",
                          cellTone(info, selected)
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        Tap a free cell to choose that court and time.
      </p>
    </div>
  );
}
