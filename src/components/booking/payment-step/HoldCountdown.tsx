"use client";

import { Hourglass } from "lucide-react";
import { formatDuration } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** Hold countdown: the bar drains as the hold runs out, turning red in the last two minutes. */
export function HoldCountdown({
  left,
  holdMinutes,
}: {
  left: number;
  holdMinutes: number;
}) {
  const tr = useT();
  const heldPct = Math.min(
    100,
    Math.max(0, (left / (holdMinutes * 60_000)) * 100)
  );
  const urgent = left < 120_000;
  return (
    <div className="border-b border-neutral-100 px-4 py-3.5 sm:px-5 md:px-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-neutral-600">
          <Hourglass className="size-4" /> {tr("Slot held for")}
        </span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            urgent ? "text-red-600" : "text-neutral-900"
          )}
        >
          {formatDuration(left)}
        </span>
      </div>
      <div className="mt-2.5 h-1 rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            urgent ? "bg-red-500" : "bg-emerald-700"
          )}
          style={{ width: `${heldPct}%` }}
        />
      </div>
    </div>
  );
}
