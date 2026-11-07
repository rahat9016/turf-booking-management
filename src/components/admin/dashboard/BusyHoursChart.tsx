"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock } from "lucide-react";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { axis, ChartCard, ChartTooltip, LegendItem } from "./ChartCard";
import { HOURS_DAYS, type HourPoint } from "./useDashboardData";

/** How often each hour of the day was booked; the peak-price hours are shaded. */
export function BusyHoursChart({
  data,
  total,
  peakStartHour,
}: {
  data: HourPoint[];
  total: number;
  peakStartHour: number;
}) {
  const t = useT();
  const firstPeak = data.find((d) => d.peak);
  const lastLabel = data[data.length - 1]?.label;
  const hrs = (n: number) => t(n === 1 ? "{n} hr" : "{n} hrs", { n });

  return (
    <ChartCard
      title="Busy hours"
      subtitle={t("Hours booked by time of day, last {n} days", {
        n: HOURS_DAYS,
      })}
      figure={hrs(total)}
      table={data.map((d) => [hourLabel(d.hour), hrs(d.games)])}
      icon={Clock}
      accent="from-sky-500 to-indigo-600"
      legend={
        <>
          <LegendItem
            swatch="from-teal-300 to-teal-500"
            label={t("Off-peak")}
          />
          <LegendItem
            swatch="from-indigo-400 to-indigo-600"
            label={t("Peak from {time}", { time: hourLabel(peakStartHour) })}
          />
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          barCategoryGap={2}
        >
          <CartesianGrid
            vertical={false}
            stroke={axis.stroke}
            strokeDasharray="3 4"
          />
          <defs>
            <linearGradient id="bar-offpeak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="bar-peak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          {firstPeak && (
            <ReferenceArea
              x1={firstPeak.label}
              x2={lastLabel}
              fill="#6366f1"
              fillOpacity={0.06}
            />
          )}
          <XAxis
            dataKey="label"
            {...axis}
            interval="preserveStartEnd"
            minTickGap={8}
          />
          <YAxis {...axis} width={40} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "#fafaf9" }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as HourPoint | undefined;
              return active && p ? (
                <ChartTooltip
                  title={`${hourLabel(p.hour)} – ${hourLabel(p.hour + 1)}`}
                  value={hrs(p.games)}
                />
              ) : null;
            }}
          />
          <Bar
            dataKey="games"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            animationDuration={900}
          >
            {data.map((d) => (
              <Cell
                key={d.hour}
                fill={d.peak ? "url(#bar-peak)" : "url(#bar-offpeak)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
