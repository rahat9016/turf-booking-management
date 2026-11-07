"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
  dot?: string;
};

/** Underlined tab strip with counts, used at the top of table and editor cards. */
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: TabItem<T>[];
}) {
  const tr = useT();
  return (
    <div
      role="tablist"
      className="flex overflow-x-auto border-b border-neutral-100 px-1 [scrollbar-width:none] sm:gap-1 sm:px-3"
    >
      {tabs.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 px-2.5 py-3.5 text-sm font-medium transition sm:gap-2 sm:px-3",
              selected
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            {t.dot && <span className={cn("size-2 rounded-full", t.dot)} />}
            {tr(t.label)}
            {t.count !== undefined && (
              <span
                className={cn(
                  "rounded-md px-1.5 text-[11px] tabular-nums",
                  selected
                    ? "bg-emerald-700 text-white"
                    : "bg-neutral-100 text-neutral-500"
                )}
              >
                {t.count}
              </span>
            )}
            {selected && (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
