"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { cardClass } from "../ui";

/** Card around one chart: title and headline figure on top, the plot, and a screen-reader table of the same data. */
export function ChartCard({
  title,
  subtitle,
  figure,
  table,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  /** Headline number beside the title. */
  figure: string;
  /** Rows for the hidden data table: [label, value]. */
  table: [string, string][];
  className?: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <section
      className={cn(cardClass, "flex min-w-0 flex-col p-4 sm:p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-neutral-900">{t(title)}</h2>
          <p className="mt-0.5 text-[13px] text-neutral-500">{subtitle}</p>
        </div>
        <p className="shrink-0 text-xl font-bold tabular-nums tracking-tight text-neutral-900 sm:text-2xl">
          {figure}
        </p>
      </div>
      <div aria-hidden className="mt-4 h-64 sm:h-72 xl:h-auto xl:min-h-64 xl:flex-1">
        {children}
      </div>
      <table className="sr-only">
        <caption>{t(title)}</caption>
        <tbody>
          {table.map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** White hover card used by both charts. */
export function ChartTooltip({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-neutral-500">{title}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-neutral-900">
        {value}
      </p>
    </div>
  );
}

/** Recessive axis/grid styling shared by both charts. */
export const axis = {
  stroke: "#e5e5e5",
  tick: { fill: "#737373", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;
export const CHART_GREEN = "#047857"; // emerald-700, the admin brand colour
