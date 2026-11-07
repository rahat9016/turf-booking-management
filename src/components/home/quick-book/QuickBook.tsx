"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { QuickDayPicker, StepBadge } from "@/src/components/common";
import { EASE, QUICK_DAYS, ROUTES } from "@/src/constants";
import { useElementSize, useHydrated, useNow } from "@/src/hooks";
import {
  addDays,
  dateLabel,
  hourLabel,
  rangeLabel,
  slotTime,
  todayYmd,
} from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { findConflict, freeSlots, hoursOf, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Court } from "@/src/types";
import { AvailabilityNote } from "./AvailabilityNote";
import { DurationSegments } from "./DurationSegments";
import { StartTimeGrid } from "./StartTimeGrid";
import { useQuickCheck } from "./useQuickCheck";

/** Hero booking card: shows which start times are free as the visitor picks, then hands off to the slot page. */
export function QuickBook() {
  const db = useTurfDB();
  const tr = useT();
  const router = useRouter();
  const hydrated = useHydrated();
  const now = useNow(15_000);
  const { settings } = db;
  // No ground picker here: if the venue ever has more than one, the first free at the chosen time gets the booking.
  const candidates = db.courts.filter((c) => c.active);

  const [date, setDate] = useState("");
  const [hour, setHour] = useState(-1);
  const [duration, setDuration] = useState(1);
  // The slot list grows and shrinks with the date; the card eases to its new height instead of jumping.
  const { ref: bodyRef, height: bodyHeight } = useElementSize<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  const day = date || (hydrated ? todayYmd() : "");
  const days = hydrated
    ? Array.from({ length: settings.bookingWindowDays }, (_, i) =>
        addDays(todayYmd(), i)
      )
    : [];
  // Hours already started are noise late in the day; taken ones stay visible so a busy day reads as busy.
  const hours = hoursOf(settings).filter(
    (h) => !hydrated || !day || slotTime(day, h) > now
  );

  const freeAt = new Map<number, Court | undefined>(
    hours.map((h) => [
      h,
      hydrated && day
        ? candidates.find(
            (c) =>
              !findConflict(
                db,
                { courtId: c.id, date: day, startHour: h, duration },
                { now }
              )
          )
        : undefined,
    ])
  );
  const freeCount = hours.filter((h) => freeAt.get(h)).length;
  const check = useQuickCheck({
    db,
    day,
    hour,
    duration,
    hours,
    candidates,
    freeAt,
    now,
  });

  const go = () => {
    const target = check?.ok ? check.court : candidates[0];
    const q = new URLSearchParams({ court: target?.id ?? "", date: day });
    if (check?.ok) q.set("start", String(hour));
    q.set("duration", String(duration));
    router.push(`${ROUTES.book}?${q}`);
  };

  return (
    <div className="w-full min-w-0 rounded-lg bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
      <motion.div
        initial={false}
        animate={{ height: bodyHeight || "auto" }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
        className="overflow-hidden rounded-lg bg-white"
      >
        <div ref={bodyRef} className="space-y-5 p-5">
          <div role="group" aria-labelledby="qb-date">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p
                id="qb-date"
                className="flex items-center text-sm font-medium text-neutral-800"
              >
                <StepBadge n={1} /> {tr("Date")}
              </p>
              {day && (
                <span className="text-sm text-neutral-500">
                  {dateLabel(day)}
                </span>
              )}
            </div>
            <QuickDayPicker
              days={days.slice(0, QUICK_DAYS)}
              value={day}
              onChange={setDate}
              calendar={
                days.length > QUICK_DAYS
                  ? {
                      first: days[0],
                      last: days[days.length - 1],
                      isFull: (d) =>
                        candidates.every((c) => freeSlots(db, c, d, now) === 0),
                    }
                  : undefined
              }
            />
          </div>

          <DurationSegments
            max={settings.maxDuration}
            value={duration}
            onChange={setDuration}
          />

          <div role="group" aria-labelledby="qb-time">
            <div className="mb-2 flex items-center justify-between">
              <p
                id="qb-time"
                className="flex items-center text-sm font-medium text-neutral-800"
              >
                <StepBadge n={2} /> {tr("Start time")}
              </p>
              {hydrated && hours.length > 0 && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    freeCount ? "text-emerald-700" : "text-red-600"
                  )}
                >
                  {freeCount
                    ? tr("{n} free", { n: freeCount })
                    : tr("Fully booked")}
                </span>
              )}
            </div>
            {hours.length === 0 && (
              <p className="rounded-lg bg-neutral-50 px-3 py-3 text-sm text-neutral-600">
                {tr("No start times left today.")}{" "}
                <button
                  onClick={() => setDate(addDays(todayYmd(), 1))}
                  className="font-semibold text-emerald-800 underline"
                >
                  {tr("See tomorrow")}
                </button>
              </p>
            )}
            <StartTimeGrid
              key={day}
              hours={hours}
              isFree={(h) => !!freeAt.get(h)}
              peakStartHour={settings.peakStartHour}
              selected={hour}
              inGame={(h) => !!check?.ok && h >= hour && h < hour + duration}
              onPick={setHour}
            />
            <p className="mt-2.5 flex items-center gap-1.5 text-sm text-neutral-500">
              <span className="size-1.5 rounded-full bg-orange-500" />{" "}
              {tr("Peak rate from {time}", {
                time: hourLabel(settings.peakStartHour),
              })}
            </p>
          </div>

          {check && (
            <AvailabilityNote
              check={check}
              onDuration={setDuration}
              onHour={setHour}
            />
          )}
        </div>
      </motion.div>
      <button
        onClick={go}
        className="mt-4 h-13 w-full rounded-lg bg-white text-base font-semibold text-emerald-950 transition hover:bg-lime-300"
      >
        {check?.ok
          ? tr("Book {time}", { time: rangeLabel(hour, duration) })
          : tr("Check live slots")}
      </button>
    </div>
  );
}
