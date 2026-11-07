"use client";

import { CalendarDays } from "lucide-react";
import { dateLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { DateCalendar } from "./DateCalendar";
import { dayChip } from "./styles";

/**
 * The next few days one tap away, then a "More" chip opening the month calendar for anything later.
 * Shared by the hero quick-book card and the admin slot picker.
 */
export function QuickDayPicker({
  days,
  value,
  onChange,
  calendar,
}: {
  /** Days shown as chips; the first is labelled "Today". */
  days: string[];
  value: string;
  onChange: (day: string) => void;
  /** Range and booked-out test for the calendar; omit to hide the "More" chip. */
  calendar?: { first: string; last: string; isFull: (day: string) => boolean };
}) {
  const t = useT();
  const later = !days.includes(value);
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {days.map((d, i) => {
        const on = d === value;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            aria-pressed={on}
            aria-label={dateLabel(d, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            className={cn(dayChip.base, on ? dayChip.on : dayChip.off)}
          >
            <span
              className={cn(
                "text-[11px] font-medium",
                on ? "text-white/75" : "text-neutral-500"
              )}
            >
              {i === 0 ? t("Today") : dateLabel(d, { weekday: "short" })}
            </span>
            <span className="text-lg font-semibold leading-tight tabular-nums">
              {dateLabel(d, { day: "numeric" })}
            </span>
          </button>
        );
      })}
      {calendar && (
        <DateCalendar
          value={value}
          first={calendar.first}
          last={calendar.last}
          isFull={calendar.isFull}
          onChange={onChange}
        >
          <button
            type="button"
            aria-label={t("Pick a later date")}
            aria-pressed={later}
            className={cn(
              dayChip.base,
              "gap-1",
              later ? dayChip.on : dayChip.off
            )}
          >
            <CalendarDays className="size-4" />
            <span className="text-[11px] font-medium">
              {later
                ? dateLabel(value, { day: "numeric", month: "short" })
                : t("More")}
            </span>
          </button>
        </DateCalendar>
      )}
    </div>
  );
}
