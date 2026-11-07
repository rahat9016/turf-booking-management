"use client";

import {
  KickoffCell,
  QuickDayPicker,
  SlotLegend,
  StepBadge,
} from "@/src/components/common";
import { QUICK_DAYS } from "@/src/constants";
import { useNow } from "@/src/hooks";
import {
  addDays,
  dateLabel,
  hourLabel,
  slotTime,
  taka,
  todayYmd,
} from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  conflictMessage,
  findConflict,
  freeSlots,
  groundOf,
  hoursOf,
  slotInfo,
  useTurfDB,
} from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Conflict } from "@/src/types";
import { DurationControl } from "./DurationControl";

/**
 * Date, duration and kick-off time, laid out like the booking site so staff and customers pick a slot the
 * same way: every hour of the chosen length lights up, and a start that can't fit that length shrinks it.
 * Used by the new-booking page and the reschedule dialog.
 */
export function SlotPicker({
  date,
  start,
  duration,
  onDate,
  onStart,
  onDuration,
  conflict,
  bookingId,
  allowNowHour,
  numbered = true,
  className,
}: {
  date: string;
  start: number | null;
  duration: number;
  onDate: (d: string) => void;
  onStart: (h: number) => void;
  onDuration: (n: number) => void;
  conflict: Conflict | null;
  /** The booking being moved: its own hours count as free. */
  bookingId?: string;
  /** Walk-ins may take the hour that is being played right now. */
  allowNowHour?: boolean;
  /** Number the Date and kick-off steps; off where the page already numbers its sections. */
  numbered?: boolean;
  /** Extra classes for the kick-off grid, e.g. more columns on a wide page. */
  className?: string;
}) {
  const db = useTurfDB();
  const now = useNow(30_000);
  const t = useT();
  const ground = groundOf(db);
  if (!ground) return null;

  const { settings } = db;
  const today = todayYmd();
  // The admin shell renders pages only after hydration, so `now` is the real clock here.
  const thisHour = new Date(now).getHours();
  const last = addDays(today, settings.bookingWindowDays - 1);
  // Staff can book longer than customers (tournaments, events) — up to the whole opening day.
  const maxHours = settings.closeHour - settings.openHour;
  const days = Array.from({ length: QUICK_DAYS }, (_, i) => addDays(today, i));
  // Hours already started are dropped, except the one being played when a walk-in can still take it.
  const nowHour = (h: number) =>
    !!allowNowHour && date === today && h === thisHour;
  const hours = hoursOf(settings).filter(
    (h) => slotTime(date, h) > now || nowHour(h)
  );
  const fits = (h: number, d: number) =>
    !findConflict(
      db,
      { courtId: ground.id, date, startHour: h, duration: d },
      { now, ignoreBookingId: bookingId, allowPast: nowHour(h) }
    );

  /** State of one hour on its own: open to start a game, or taken (and why). */
  const cell = (h: number) => {
    const info = slotInfo(db, ground, date, h, now, "");
    const own = info.kind === "booked" && info.booking.id === bookingId;
    const open =
      own || info.kind === "free" || (info.kind === "past" && nowHour(h));
    const note = t(
      open
        ? "Available"
        : info.kind === "blocked"
          ? "Closed"
          : info.kind === "held"
            ? "Being paid"
            : "Booked"
    );
    return { open, note };
  };

  const pick = (h: number) => {
    onStart(h);
    // Keep the chosen length if it still fits from here, otherwise shrink to what does.
    let d = duration;
    while (d > 1 && !fits(h, d)) d--;
    if (d !== duration) onDuration(d);
  };

  const groups = [
    {
      label: "Morning & Afternoon",
      rate: ground.price,
      hs: hours.filter((h) => h < settings.peakStartHour),
    },
    {
      label: "Evening",
      rate: ground.peakPrice,
      hs: hours.filter((h) => h >= settings.peakStartHour),
    },
  ];

  return (
    <div className="space-y-5">
      <div role="group" aria-labelledby="sp-date">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p
            id="sp-date"
            className="flex items-center text-sm font-medium text-neutral-800"
          >
            {numbered && <StepBadge n={1} />} {t("Date")}
          </p>
          <span className="text-sm text-neutral-500">{dateLabel(date)}</span>
        </div>
        <QuickDayPicker
          days={days}
          value={date}
          onChange={onDate}
          calendar={{
            first: today,
            last: date > last ? date : last,
            isFull: (d) => freeSlots(db, ground, d, now) === 0,
          }}
        />
      </div>

      <DurationControl
        value={duration}
        onChange={onDuration}
        max={maxHours}
        fits={(n) => start === null || fits(start, n)}
      />

      <div role="group" aria-labelledby="sp-time">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p
            id="sp-time"
            className="flex items-center text-sm font-medium text-neutral-800"
          >
            {numbered && <StepBadge n={2} />} {t("Pick your kick-off")}
          </p>
          <SlotLegend className="gap-3" dotClassName="size-3" />
        </div>

        {hours.length === 0 ? (
          <p className="mt-3 rounded-lg bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600">
            {t("No kick-off times left on this day.")}{" "}
            <button
              type="button"
              onClick={() => onDate(addDays(date, 1))}
              className="font-semibold text-emerald-800 underline"
            >
              {t("See the next day")}
            </button>
          </p>
        ) : (
          groups.map(
            (g) =>
              g.hs.length > 0 && (
                <div key={g.label} className="mt-4">
                  <p className="mb-2 flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-neutral-800">
                      {t(g.label)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {t("{amount}/hr", { amount: taka(g.rate) })}
                    </span>
                  </p>
                  <div
                    className={cn(
                      "grid grid-cols-3 gap-2 sm:grid-cols-4",
                      className
                    )}
                  >
                    {g.hs.map((h) => {
                      const { open, note } = cell(h);
                      return (
                        <KickoffCell
                          key={h}
                          hour={h}
                          open={open}
                          selected={
                            start !== null && h >= start && h < start + duration
                          }
                          note={note}
                          onPick={pick}
                          className="py-2.5"
                        />
                      );
                    })}
                  </div>
                </div>
              )
          )
        )}
        {conflict && start !== null && (
          <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {conflict.kind === "booking"
              ? t("{hours} from {time} clashes with {code}.", {
                  hours: t(duration === 1 ? "{n} hr" : "{n} hrs", {
                    n: duration,
                  }),
                  time: hourLabel(start),
                  code: conflict.booking.code,
                })
              : t(conflictMessage(conflict))}
          </p>
        )}
      </div>
    </div>
  );
}
