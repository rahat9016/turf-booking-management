import { dateLabel } from "@/src/lib/format";
import { cn } from "@/src/lib/utils";
import type { Booking, Phase } from "@/src/types";

const tileTones: Record<Phase, string> = {
  booked: "bg-emerald-50 text-emerald-700",
  playing: "bg-lime-100 text-lime-800",
  played: "bg-neutral-100 text-neutral-500",
  cancelled: "bg-rose-50 text-rose-600",
};

/** Phone list: match day as a small calendar tile, tinted by status so the list scans at a glance. */
export function DateTile({ b, phase }: { b: Booking; phase: Phase }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 flex-col items-center justify-center rounded-xl leading-none",
        tileTones[phase]
      )}
    >
      <span className="text-[17px] font-bold tabular-nums">
        {Number(b.date.slice(8))}
      </span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">
        {dateLabel(b.date, { month: "short" })}
      </span>
    </span>
  );
}
