"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { axis, CHART_GREEN, ChartCard, ChartTooltip } from "./ChartCard";
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
          {firstPeak && (
            <ReferenceArea
              x1={firstPeak.label}
              x2={lastLabel}
              fill="#84cc16"
              fillOpacity={0.08}
              label={{
                value: t("Peak from {time}", {
                  time: hourLabel(peakStartHour),
                }),
                position: "insideTopLeft",
                fill: "#4d7c0f",
                fontSize: 11,
              }}
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
            cursor={{ fill: "#f5f5f5" }}
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
            fill={CHART_GREEN}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
