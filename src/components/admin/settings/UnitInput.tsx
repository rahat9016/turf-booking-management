"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { inputClass } from "../ui";

/** Number input clamped to [min, max], with a unit on the right. */
export function UnitInput({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  const t = useT();
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))
        }
        className={cn(inputClass, "pr-14")}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
        {t(unit)}
      </span>
    </div>
  );
}
