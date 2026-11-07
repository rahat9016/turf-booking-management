"use client";

import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { type MoneyIcon, MoneyGlyph } from "./MoneyGlyph";

const moneyTones = {
  green: { badge: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
  sky: { badge: "bg-sky-50 text-sky-600", bar: "bg-sky-500" },
  rose: { badge: "bg-rose-50 text-rose-600", bar: "bg-rose-500" },
  violet: { badge: "bg-violet-50 text-violet-600", bar: "bg-violet-500" },
  slate: { badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400" },
};

export type MoneyTone = keyof typeof moneyTones;

/** Money tile: ৳ icon on an animated backdrop (hover), the amount and one line of context. */
export function MoneyCard({
  label,
  value,
  hint,
  icon,
  tone,
  index = 0,
  className,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: MoneyIcon;
  tone: MoneyTone;
  index?: number;
  className?: string;
}) {
  const t = moneyTones[tone];
  const tr = useT();
  return (
    <section
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md sm:p-4",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-0.5 opacity-70", t.bar)}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 pt-0.5 text-[13px] font-medium text-neutral-600 sm:pt-1">
          {tr(label)}
        </p>
        <span
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-full sm:size-14",
            t.badge
          )}
        >
          <svg
            viewBox="0 0 56 56"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="currentColor"
              className="tw-ripple opacity-0"
              style={{ animationDelay: `${index * 300}ms` }}
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="currentColor"
              className="tw-ripple opacity-0"
              style={{ animationDelay: `${index * 300 + 1400}ms` }}
            />
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 5"
              strokeLinecap="round"
              className="tw-spin opacity-40"
            />
          </svg>
          <MoneyGlyph icon={icon} className="relative size-5 sm:size-7" />
        </span>
      </div>
      <p className="mt-auto pt-1.5 text-xl font-bold tabular-nums tracking-tight text-neutral-900 sm:pt-3 sm:text-2xl">
        {taka(value)}
      </p>
      {hint && (
        <p className="mt-0.5 text-xs text-neutral-500 sm:text-[13px]">
          {tr(hint)}
        </p>
      )}
    </section>
  );
}
