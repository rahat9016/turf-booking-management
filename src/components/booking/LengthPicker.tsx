"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { StepTitle } from "./Step";

/** Step 2: how many hours; lengths that would run into another booking are disabled. */
export function LengthPicker({
  max,
  value,
  onChange,
  isBlocked,
}: {
  max: number;
  value: number;
  onChange: (n: number) => void;
  isBlocked: (n: number) => boolean;
}) {
  const tr = useT();
  return (
    <>
      <StepTitle n={2}>{tr("How long?")}</StepTitle>
      <div className="mt-4 flex gap-2 sm:flex-wrap">
        {Array.from({ length: max }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            disabled={isBlocked(d)}
            onClick={() => onChange(d)}
            aria-pressed={d === value}
            className={cn(
              "h-11 min-w-0 flex-1 whitespace-nowrap rounded-lg border px-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none sm:px-6",
              d === value
                ? "border-emerald-900 bg-emerald-900 text-white"
                : "border-neutral-200 text-neutral-800 hover:border-emerald-700"
            )}
          >
            {tr(d > 1 ? "{n} hours" : "{n} hour", { n: d })}
          </button>
        ))}
      </div>
    </>
  );
}
