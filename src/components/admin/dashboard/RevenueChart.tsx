"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dateLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { axis, CHART_GREEN, ChartCard, ChartTooltip } from "./ChartCard";
import { REVENUE_DAYS, type RevenuePoint } from "./useDashboardData";

const compact = (n: number) =>
  Math.abs(n) >= 1000 ? `৳${Math.round(n / 100) / 10}k` : `৳${n}`;

/** Net takings per day over the last two weeks. */
export function RevenueChart({
  data,
  total,
}: {
  data: RevenuePoint[];
  total: number;
}) {
  const t = useT();
  return (
    <ChartCard
      title="Revenue"
      subtitle={t("Net takings, last {n} days", { n: REVENUE_DAYS })}
      figure={taka(total)}
      table={data.map((d) => [d.label, taka(d.amount)])}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_GREEN} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_GREEN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={axis.stroke}
            strokeDasharray="3 4"
          />
          <XAxis
            dataKey="label"
            {...axis}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis {...axis} width={56} tickFormatter={compact} />
          <Tooltip
            cursor={{ stroke: "#a3a3a3", strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as RevenuePoint | undefined;
              return active && p ? (
                <ChartTooltip
                  title={dateLabel(p.date, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  value={taka(p.amount)}
                />
              ) : null;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={CHART_GREEN}
            strokeWidth={2}
            fill="url(#revenue-fill)"
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "#fff",
              fill: CHART_GREEN,
            }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
