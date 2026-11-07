"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** "1 hr / 2 hr / 3 hr" segmented control. */
export function DurationSegments({
  max,
  value,
  onChange,
}: {
  max: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const tr = useT();
  return (
    // Phones: label on its own line and the lengths share the full width, so longer (Bangla) labels never wrap.
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <p className="text-sm font-medium text-neutral-800">{tr("Duration")}</p>
      <div className="flex h-10 gap-1 rounded-lg bg-neutral-100 p-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            aria-pressed={d === value}
            className={cn(
              "min-w-0 flex-1 whitespace-nowrap rounded-lg px-2.5 text-sm font-medium transition sm:min-w-14 sm:flex-none sm:px-3",
              d === value
                ? "bg-emerald-800 text-white"
                : "text-neutral-600 hover:bg-white"
            )}
          >
            {tr("{n} hr", { n: d })}
          </button>
        ))}
      </div>
    </div>
  );
}
