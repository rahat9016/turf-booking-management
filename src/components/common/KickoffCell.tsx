"use client";

import { clock } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** One kick-off hour on the slot grid: time on top, its state ("Available", "Booked" …) below. */
export function KickoffCell({
  hour,
  open,
  selected,
  note,
  onPick,
  className,
}: {
  hour: number;
  /** Can be picked as (part of) the game. */
  open: boolean;
  selected: boolean;
  /** State shown under the time when not selected. */
  note: string;
  onPick: (h: number) => void;
  className?: string;
}) {
  const t = useT();
  return (
    <button
      type="button"
      disabled={!open}
      onClick={() => onPick(hour)}
      aria-pressed={selected}
      className={cn(
        "rounded-lg border px-1.5 text-center transition disabled:cursor-not-allowed",
        selected
          ? "border-lime-400 bg-lime-400 text-emerald-950"
          : open
            ? "border-neutral-200 bg-white text-neutral-900 hover:border-emerald-700"
            : "border-transparent bg-neutral-100 text-neutral-400",
        className
      )}
    >
      <span
        className={cn(
          "block whitespace-nowrap text-sm font-semibold tabular-nums",
          !open && !selected && "line-through decoration-neutral-300"
        )}
      >
        {clock(hour)}
      </span>
      <span
        className={cn(
          "mt-0.5 block text-xs leading-tight",
          selected
            ? "text-emerald-950/80"
            : open
              ? "text-emerald-700"
              : "text-neutral-400"
        )}
      >
        {selected ? t("Selected") : note}
      </span>
    </button>
  );
}
