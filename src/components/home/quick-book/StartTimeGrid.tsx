"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/src/constants";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** Start-time buttons; every hour of a valid pick lights up, not just the kick-off. */
export function StartTimeGrid({
  hours,
  isFree,
  peakStartHour,
  selected,
  inGame,
  onPick,
}: {
  hours: number[];
  isFree: (h: number) => boolean;
  peakStartHour: number;
  selected: number;
  inGame: (h: number) => boolean;
  onPick: (h: number) => void;
}) {
  const tr = useT();
  const reduceMotion = useReducedMotion();
  return (
    <div className="grid grid-cols-4 gap-2">
      {hours.map((h, i) => {
        const ok = isFree(h);
        const peak = h >= peakStartHour;
        const isSelected = h === selected;
        const lit = inGame(h);
        return (
          <motion.button
            key={h}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: Math.min(i * 0.02, 0.3),
              ease: EASE,
            }}
            disabled={!ok}
            onClick={() => onPick(h)}
            aria-pressed={isSelected || lit}
            aria-label={`${hourLabel(h)}${ok ? "" : `, ${tr("taken")}`}${peak ? `, ${tr("peak rate")}` : ""}`}
            className={cn(
              "relative h-11 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed",
              lit
                ? "bg-emerald-800 text-white disabled:cursor-default"
                : isSelected
                  ? "bg-red-50 text-red-600 ring-1 ring-red-300"
                  : ok
                    ? "bg-neutral-100 text-neutral-800 hover:bg-emerald-50 hover:ring-1 hover:ring-emerald-500"
                    : "bg-neutral-50 text-neutral-300 line-through"
            )}
          >
            {hourLabel(h).toLowerCase()}
            {peak && ok && !lit && (
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-orange-500" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
