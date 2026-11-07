"use client";

import { statusLabels, statusStyles } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { useT } from "@/src/lib/i18n";
import { phaseOf } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking, Phase } from "@/src/types";

const statusDots: Record<Phase, string> = {
  booked: "bg-emerald-500",
  playing: "bg-lime-500 animate-pulse",
  played: "bg-neutral-400",
  cancelled: "bg-rose-500",
};

export function StatusBadge({
  booking,
  className,
}: {
  booking: Booking;
  className?: string;
}) {
  const phase = phaseOf(booking, useNow(30_000));
  const tr = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[phase],
        className
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", statusDots[phase])}
      />
      {tr(statusLabels[phase])}
    </span>
  );
}
