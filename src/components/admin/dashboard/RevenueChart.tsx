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
import { TrendingUp } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { axis, ChartCard, ChartTooltip } from "./ChartCard";
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
      icon={TrendingUp}
      accent="from-emerald-500 to-teal-600"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenue-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0891b2" />
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
            stroke="url(#revenue-line)"
            strokeWidth={2.5}
            fill="url(#revenue-fill)"
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "#fff",
              fill: "#0d9488",
            }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
