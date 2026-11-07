"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES, statusLabels, statusStyles } from "@/src/constants";
import { dateLabel, rangeLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { Booking, Phase } from "@/src/types";
import { focusRing } from "../ui";
import { DateTile } from "./DateTile";
import { PayShort } from "./PayInfo";

/** Phones and tablets: one card per booking instead of a squeezed table. */
export function BookingListItem({ b, phase }: { b: Booking; phase: Phase }) {
  const t = useT();
  return (
    <li>
      <Link
        href={ROUTES.adminBooking(b.id)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition active:bg-emerald-50/60",
          focusRing,
          "focus-visible:ring-inset"
        )}
      >
        <DateTile b={b} phase={phase} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-neutral-900">
              {b.customer.name}
            </p>
            <span
              className={cn(
                "inline-flex max-w-[50%] shrink-0 truncate rounded px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                statusStyles[phase]
              )}
            >
              {t(statusLabels[phase])}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[13px]">
            <p className="truncate text-neutral-600">
              {dateLabel(b.date, { weekday: "short" })} ·{" "}
              {rangeLabel(b.startHour, b.duration)}
            </p>
            <PayShort b={b} />
          </div>
        </div>
        <ChevronRight
          className="size-4 shrink-0 text-neutral-300"
          aria-hidden
        />
      </Link>
    </li>
  );
}
