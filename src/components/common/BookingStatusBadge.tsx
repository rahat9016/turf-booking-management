"use client";

import { statusLabels, statusStyles } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { useT } from "@/src/lib/i18n";
import { phaseOf } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { LiveDot } from "./LiveDot";

export function BookingStatusBadge({
  booking,
  className,
}: {
  booking: Booking;
  className?: string;
}) {
  const phase = phaseOf(booking, useNow(30_000));
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[phase],
        className
      )}
    >
      {phase === "playing" && <LiveDot className="size-1.5" />}
      {t(statusLabels[phase])}
    </span>
  );
}
