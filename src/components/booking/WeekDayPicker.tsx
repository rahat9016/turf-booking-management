"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DateCalendar } from "@/src/components/common";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { StepTitle } from "./Step";

/** Step 1: a week of day buttons with week paging and a month calendar for jumping ahead. */
export function WeekDayPicker({
  days,
  value,
  week,
  onWeek,
  isFull,
  onPick,
  onCalendarPick,
}: {
  /** Every bookable day. */
  days: string[];
  value: string;
  /** Index of the week shown. */
  week: number;
  onWeek: (w: number) => void;
  isFull: (day: string) => boolean;
  onPick: (day: string) => void;
  /** Picking from the calendar also snaps the week back to follow the selection. */
  onCalendarPick: (day: string) => void;
}) {
  const tr = useT();
  const weeks = Math.ceil(days.length / 7);
  const weekDays = days.slice(week * 7, week * 7 + 7);
  const navBtn =
    "flex size-8 items-center justify-center rounded-lg hover:bg-neutral-100 disabled:opacity-30";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StepTitle n={1}>{tr("Choose a day")}</StepTitle>
        <div className="flex items-center gap-2 text-sm text-neutral-600 max-sm:w-full">
          <DateCalendar
            value={value}
            first={days[0]}
            last={days[days.length - 1]}
            isFull={isFull}
            onChange={onCalendarPick}
          >
            <button
              aria-label={tr("Open calendar")}
              className="-ml-2 flex h-8 items-center gap-2 rounded-lg px-2 transition hover:bg-neutral-100 hover:text-emerald-800"
            >
              {new Date(`${weekDays[0]}T00:00`).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
              <CalendarDays className="size-4" />
            </button>
          </DateCalendar>
          <button
            onClick={() => onWeek(week - 1)}
            disabled={week === 0}
            aria-label={tr("Previous week")}
            className={cn(navBtn, "max-sm:ml-auto")}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => onWeek(week + 1)}
            disabled={week >= weeks - 1}
            aria-label={tr("Next week")}
            className={navBtn}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((d) => {
          const dt = new Date(`${d}T00:00`);
          const active = d === value;
          const full = isFull(d);
          return (
            <button
              key={d}
              onClick={() => onPick(d)}
              aria-pressed={active}
              className={cn(
                "relative flex flex-col items-center rounded-lg border py-2.5 transition sm:py-3",
                active
                  ? "border-emerald-900 bg-emerald-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-emerald-700",
                full && !active && "text-neutral-300"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-medium uppercase",
                  active ? "text-white/70" : "text-neutral-500"
                )}
              >
                {dt.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span className="mt-1 text-xl font-semibold tabular-nums md:text-2xl">
                {String(dt.getDate()).padStart(2, "0")}
              </span>
              {active && (
                <span className="absolute bottom-2 h-0.5 w-6 rounded-full bg-lime-400" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
