"use client";

import { hourLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import type { Court, Quote, Settings } from "@/src/types";

/** Ticket body on the slot step: hourly rate, length, total, and the advance / at-ground split. */
export function PriceBreakdown({
  court,
  settings,
  duration,
  peakHours,
  price,
}: {
  court: Court;
  settings: Settings;
  duration: number;
  peakHours: number;
  price: Quote | null;
}) {
  const tr = useT();
  const { peakStartHour, advancePercent } = settings;
  const offPeakOnly = peakHours === 0;
  const allPeak = price ? peakHours === duration : false;

  return (
    <dl className="text-sm">
      <div className="flex justify-between gap-3 py-1.5">
        <dt className="text-white/80">
          {offPeakOnly
            ? tr("Hourly rate (before {time})", {
                time: hourLabel(peakStartHour),
              })
            : allPeak
              ? tr("Hourly rate (from {time})", {
                  time: hourLabel(peakStartHour),
                })
              : tr("Hourly rate (mixed)")}
        </dt>
        <dd className="tabular-nums">
          {offPeakOnly
            ? taka(court.price)
            : allPeak
              ? taka(court.peakPrice)
              : `${taka(court.price)} / ${taka(court.peakPrice)}`}
        </dd>
      </div>
      <div className="flex justify-between gap-3 py-1.5">
        <dt className="text-white/80">{tr("Duration")}</dt>
        <dd>{tr(duration > 1 ? "{n} hours" : "{n} hour", { n: duration })}</dd>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-y border-white/10 py-4">
        <dt className="text-lg">{tr("Total")}</dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {price ? taka(price.total) : "—"}
        </dd>
      </div>
      <div className="flex justify-between gap-3 border-b border-white/10 py-3.5">
        <dt className="text-white/70">
          {tr("Pay now ({n}%)", { n: advancePercent })}
        </dt>
        <dd className="text-lg font-semibold tabular-nums">
          {price ? taka(price.advance) : "—"}
        </dd>
      </div>
      <div className="flex justify-between gap-3 py-3.5">
        <dt className="text-white/80">{tr("Pay at ground")}</dt>
        <dd className="text-lg font-semibold tabular-nums">
          {price ? taka(price.total - price.advance) : "—"}
        </dd>
      </div>
    </dl>
  );
}
