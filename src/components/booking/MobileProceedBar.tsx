"use client";

import { ArrowRight } from "lucide-react";
import { clock, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";

/** Phone: keeps the next step in reach while scrolling the times. */
export function MobileProceedBar({
  startHour,
  duration,
  advance,
  onProceed,
}: {
  startHour: number;
  duration: number;
  advance: number;
  onProceed: () => void;
}) {
  const tr = useT();
  return (
    <div className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-lg bg-emerald-950 p-3 pl-4 text-white shadow-xl lg:hidden">
      <div className="min-w-0 text-sm">
        <p className="truncate font-semibold">
          {clock(startHour)} – {clock(startHour + duration)}
        </p>
        <p className="text-xs text-white/70">
          {tr("{amount} to pay now", { amount: taka(advance) })}
        </p>
      </div>
      <button
        onClick={onProceed}
        className="flex h-11 items-center gap-2 rounded-lg bg-lime-400 px-4 text-sm font-semibold text-emerald-950"
      >
        {tr("Continue")} <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
