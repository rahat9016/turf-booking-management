"use client";

import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { IconType } from "@/src/types";
import { type MoneyIcon, MoneyGlyph } from "./MoneyGlyph";

const moneyTones = {
  green: {
    badge: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
    solid: "from-emerald-500 to-emerald-700 shadow-emerald-700/20",
  },
  teal: {
    badge: "bg-teal-50 text-teal-600",
    bar: "bg-teal-500",
    solid: "from-teal-500 to-cyan-700 shadow-cyan-700/20",
  },
  sky: {
    badge: "bg-sky-50 text-sky-600",
    bar: "bg-sky-500",
    solid: "from-sky-500 to-blue-700 shadow-blue-700/20",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-600",
    bar: "bg-indigo-500",
    solid: "from-indigo-500 to-violet-700 shadow-indigo-700/20",
  },
  rose: {
    badge: "bg-rose-50 text-rose-600",
    bar: "bg-rose-500",
    solid: "from-rose-500 via-pink-600 to-fuchsia-700 shadow-pink-600/25",
  },
  violet: {
    badge: "bg-violet-50 text-violet-600",
    bar: "bg-violet-500",
    solid: "from-violet-500 via-purple-600 to-indigo-700 shadow-purple-600/25",
  },
  slate: {
    badge: "bg-slate-100 text-slate-600",
    bar: "bg-slate-400",
    solid: "from-slate-600 via-slate-700 to-slate-900 shadow-slate-700/25",
  },
};

export type MoneyTone = keyof typeof moneyTones;

function Icon({ icon: I }: { icon: IconType }) {
  return <I className="size-5 sm:size-6" />;
}

/** Stat tile: ৳ icon on an animated backdrop (hover), the amount and one line of context. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
  index = 0,
  solid,
  className,
}: {
  label: string;
  /** A number is shown as taka; pass a string for counts or percentages. */
  value: number | string;
  hint?: string;
  /** A ৳ line glyph, or any icon component. */
  icon: MoneyIcon | IconType;
  tone: MoneyTone;
  index?: number;
  /** Full gradient tile with white text (dashboard); default is a white card with a tinted icon. */
  solid?: boolean;
  className?: string;
}) {
  const t = moneyTones[tone];
  const tr = useT();
  return (
    <section
      className={cn(
        "group relative flex min-h-32 min-w-0 flex-col overflow-hidden rounded-xl p-3 transition hover:-translate-y-0.5 sm:min-h-40 sm:p-5",
        solid
          ? cn(
              "bg-gradient-to-br text-white shadow-lg hover:shadow-xl",
              t.solid
            )
          : "border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md",
        className
      )}
    >
      {solid ? (
        <SolidBackdrop index={index} />
      ) : (
        <span
          aria-hidden
          className={cn("absolute inset-x-0 top-0 h-0.5 opacity-70", t.bar)}
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "relative min-w-0 pt-0.5 text-[13px] font-medium sm:pt-1",
            solid ? "text-white/85" : "text-neutral-600"
          )}
        >
          {tr(label)}
        </p>
        <span
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-full sm:size-14",
            solid ? "bg-white/15 text-white ring-1 ring-white/25" : t.badge
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
          <span
            className="tw-float relative"
            style={{ animationDelay: `${index * 250}ms` }}
          >
            {typeof icon === "string" ? (
              <MoneyGlyph icon={icon} className="size-5 sm:size-7" />
            ) : (
              <Icon icon={icon} />
            )}
          </span>
        </span>
      </div>
      <p
        className={cn(
          "relative mt-auto pt-1.5 text-xl font-bold tabular-nums tracking-tight sm:pt-3 sm:text-3xl",
          solid ? "text-white" : "text-neutral-900"
        )}
      >
        {typeof value === "number" ? taka(value) : value}
      </p>
      {hint && (
        <p
          className={cn(
            "relative mt-0.5 text-xs sm:text-[13px]",
            solid ? "text-white/75" : "text-neutral-500"
          )}
        >
          {tr(hint)}
        </p>
      )}
    </section>
  );
}

/** Soft light blobs and a drifting wave line behind the content of a solid tile. */
function SolidBackdrop({ index }: { index: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <circle cx="175" cy="10" r="55" fill="white" opacity="0.1" />
      <circle cx="15" cy="125" r="45" fill="white" opacity="0.08" />
      <path
        d="M0 92 C 35 72, 65 108, 100 88 S 165 70, 200 86"
        fill="none"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="tw-dash"
        style={{ animationDelay: `${index * 400}ms` }}
      />
    </svg>
  );
}

/** Kept for the Payments page: a stat tile whose value is money. */
export const MoneyCard = StatCard;
