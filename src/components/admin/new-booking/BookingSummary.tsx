"use client";

import { dateLabel, rangeLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { Quote } from "@/src/types";
import { abtn, cardClass } from "../ui";

/** Sticky summary of the new booking with the create button. */
export function BookingSummary({
  date,
  start,
  duration,
  price,
  amount,
  disabled,
  onSave,
}: {
  date: string;
  start: number | null;
  duration: number;
  price: Quote | null;
  amount: number;
  disabled: boolean;
  onSave: () => void;
}) {
  const t = useT();
  const rows = [
    [
      "Date",
      dateLabel(date, { weekday: "short", day: "numeric", month: "short" }),
    ],
    ["Time", start !== null ? rangeLabel(start, duration) : "—"],
    ["Total", price ? taka(price.total) : "—"],
  ];
  return (
    <aside className={cn(cardClass, "lg:sticky lg:top-20")}>
      <h2 className="border-b border-neutral-100 px-4 py-3.5 font-semibold text-neutral-900">
        {t("Summary")}
      </h2>
      <dl className="space-y-2.5 px-4 py-4 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-neutral-600">{t(k)}</dt>
            <dd className="text-right font-medium text-neutral-900">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-baseline justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-3">
        <span className="font-semibold">{t("Pay now")}</span>
        <span className="text-lg font-semibold tabular-nums">
          {price ? taka(amount) : "—"}
        </span>
      </div>
      <div className="flex justify-between border-t border-neutral-100 px-4 py-3 text-sm">
        <span className="text-neutral-600">{t("Pay at ground")}</span>
        <span className="font-medium tabular-nums">
          {price ? taka(price.total - amount) : "—"}
        </span>
      </div>
      <div className="p-4 pt-1">
        <button
          onClick={onSave}
          disabled={disabled}
          className={cn(abtn.primary, "h-11 w-full text-base")}
        >
          {price
            ? t("Book · {amount}", { amount: taka(amount) })
            : t("Create booking")}
        </button>
      </div>
    </aside>
  );
}
