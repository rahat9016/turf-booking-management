"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** One-tap lengths; anything else goes through Custom. */
const PRESETS = [1, 2, 3];
const segment =
  "min-w-0 whitespace-nowrap rounded-lg px-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 sm:min-w-14 sm:px-3";
const stepBtn =
  "flex size-9 items-center justify-center rounded-lg bg-white text-neutral-700 ring-1 ring-neutral-200 transition hover:ring-emerald-500 disabled:opacity-40";

/** 1 / 2 / 3 hr presets plus a Custom −/+ stepper, up to `max` hours. */
export function DurationControl({
  value,
  onChange,
  max,
  fits,
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
  fits: (n: number) => boolean;
}) {
  const t = useT();
  const [custom, setCustom] = useState(!PRESETS.includes(value));
  return (
    <div>
      {/* Phones: label on its own line and the four lengths share the full width. */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-sm font-medium text-neutral-800">{t("Duration")}</p>
        <div className="grid h-11 grid-cols-4 gap-1 rounded-lg bg-neutral-100 p-1 sm:flex sm:h-10">
          {PRESETS.map((d) => {
            const on = !custom && d === value;
            return (
              <button
                key={d}
                type="button"
                // Once a kick-off is picked, lengths that would run into another booking are off.
                disabled={!fits(d)}
                onClick={() => {
                  setCustom(false);
                  onChange(d);
                }}
                aria-pressed={on}
                className={cn(
                  segment,
                  on
                    ? "bg-emerald-800 text-white"
                    : "text-neutral-600 hover:bg-white"
                )}
              >
                {t("{n} hr", { n: d })}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCustom(true)}
            aria-pressed={custom}
            className={cn(
              segment,
              custom
                ? "bg-emerald-800 text-white"
                : "text-neutral-600 hover:bg-white"
            )}
          >
            {t("Custom")}
          </button>
        </div>
      </div>
      {custom && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
          <p className="text-sm text-neutral-600">{t("Hours")}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange(Math.max(1, value - 1))}
              disabled={value <= 1}
              aria-label={t("One hour less")}
              className={stepBtn}
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-16 text-center text-sm font-semibold tabular-nums text-neutral-900">
              {t(value === 1 ? "{n} hr" : "{n} hrs", { n: value })}
            </span>
            <button
              type="button"
              onClick={() => onChange(Math.min(max, value + 1))}
              disabled={value >= max || !fits(value + 1)}
              aria-label={t("One hour more")}
              className={stepBtn}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
