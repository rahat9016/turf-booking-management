"use client";

import { CalendarCheck2, Gauge } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { StatCard } from "../ui";
import { BusyHoursChart } from "./BusyHoursChart";
import { RevenueChart } from "./RevenueChart";
import { useDashboardData } from "./useDashboardData";

export function Dashboard() {
  const t = useT();
  const {
    stats: s,
    revenue,
    revenueTotal,
    byHour,
    hoursTotal,
    peakStartHour,
  } = useDashboardData();

  return (
    <div className="flex flex-col gap-3 sm:gap-4 xl:h-[calc(100dvh-6rem)]">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="This month"
          value={s.month}
          hint={t("Net takings so far")}
          icon="wallet"
          tone="cyan"
          index={0}
          solid
        />
        <StatCard
          label="Games today"
          value={String(s.todayGames)}
          hint={t("{n} still to play", { n: s.gamesLeft })}
          icon={CalendarCheck2}
          tone="sky"
          index={1}
          solid
        />
        <StatCard
          label="Ground booked today"
          value={`${s.occupancy}%`}
          hint={t("{a} of {b} hours", { a: s.bookedHours, b: s.openHours })}
          icon={Gauge}
          tone="blue"
          index={2}
          solid
        />
        <StatCard
          label="To collect"
          value={s.due}
          hint={t(s.dueCount === 1 ? "{n} booking" : "{n} bookings", {
            n: s.dueCount,
          })}
          icon="bill"
          tone="indigo"
          index={3}
          solid
        />
      </div>

      <div className="grid gap-3 sm:gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
        <RevenueChart data={revenue} total={revenueTotal} />
        <BusyHoursChart
          data={byHour}
          total={hoursTotal}
          peakStartHour={peakStartHour}
        />
      </div>
    </div>
  );
}
