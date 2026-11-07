"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { focusRing } from "./styles";

export type ViewPill<T extends string> = {
  value: T;
  label: string;
  count?: number;
  group: number;
};

/** Row of rounded view pills; `group` changes insert a thin divider, and only views with a count show one. */
export function ViewPills<T extends string>({
  value,
  onChange,
  views,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  views: ViewPill<T>[];
  label: string;
}) {
  const tr = useT();
  return (
    <div
      role="group"
      aria-label={tr(label)}
      className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-100 p-3 [scrollbar-width:none] sm:flex-wrap sm:px-4"
    >
      {views.map((v, i) => {
        const selected = value === v.value;
        return (
          <span key={v.value} className="contents">
            {i > 0 && views[i - 1].group !== v.group && (
              <span
                aria-hidden
                className="mx-0.5 h-6 w-px shrink-0 bg-neutral-200"
              />
            )}
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(v.value)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm font-medium transition",
                focusRing,
                selected
                  ? "border-indigo-700 bg-indigo-700 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-indigo-300 hover:text-indigo-800"
              )}
            >
              {tr(v.label)}
              {v.count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 rounded px-1.5 text-center text-[13px] font-semibold tabular-nums leading-5",
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-700"
                  )}
                >
                  {v.count}
                </span>
              )}
            </button>
          </span>
        );
      })}
    </div>
  );
}
