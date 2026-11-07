"use client";

import { useMemo } from "react";
import { useNow } from "@/src/hooks";
import { addDays, dateLabel, hourShort, todayYmd, ymd } from "@/src/lib/format";
import {
  dueOf,
  endMs,
  groundOf,
  hoursOf,
  occupies,
  useTurfDB,
} from "@/src/lib/store";

export const REVENUE_DAYS = 14;
export const HOURS_DAYS = 30;

export type RevenuePoint = { date: string; label: string; amount: number };
export type HourPoint = {
  hour: number;
  label: string;
  games: number;
  peak: boolean;
};

/** Everything the dashboard shows, computed from the store. */
export function useDashboardData() {
  const db = useTurfDB();
  const now = useNow(60_000);

  return useMemo(() => {
    const today = todayYmd();
    const { settings } = db;
    const ground = groundOf(db);
    const live = db.bookings.filter(occupies);

    // Net takings per day (refunds subtract), oldest first.
    const days = Array.from({ length: REVENUE_DAYS }, (_, i) =>
      addDays(today, i - REVENUE_DAYS + 1)
    );
    const byDay = new Map(days.map((d) => [d, 0]));
    let month = 0;
    for (const b of db.bookings)
      for (const p of b.payments) {
        const d = ymd(new Date(p.at));
        const signed = p.kind === "refund" ? -p.amount : p.amount;
        if (byDay.has(d)) byDay.set(d, byDay.get(d)! + signed);
        if (d.slice(0, 7) === today.slice(0, 7)) month += signed;
      }
    const revenue: RevenuePoint[] = days.map((d) => ({
      date: d,
      label: dateLabel(d, { day: "numeric", month: "short" }),
      amount: byDay.get(d)!,
    }));

    // Hours played per kick-off hour over the last 30 days.
    const from = addDays(today, -HOURS_DAYS + 1);
    const hours = hoursOf(settings);
    const counts = new Map(hours.map((h) => [h, 0]));
    for (const b of live) {
      if (b.date < from || b.date > today) continue;
      for (let h = b.startHour; h < b.startHour + b.duration; h++)
        if (counts.has(h)) counts.set(h, counts.get(h)! + 1);
    }
    const byHour: HourPoint[] = hours.map((h) => ({
      hour: h,
      label: hourShort(h),
      games: counts.get(h)!,
      peak: h >= settings.peakStartHour,
    }));

    // Today.
    const todays = live.filter(
      (b) => b.date === today && (!ground || b.courtId === ground.id)
    );
    const bookedHours = todays.reduce((s, b) => s + b.duration, 0);
    const openHours = Math.max(1, settings.closeHour - settings.openHour);
    const owing = db.bookings.filter((b) => dueOf(b) > 0);

    return {
      revenue,
      revenueTotal: revenue.reduce((s, r) => s + r.amount, 0),
      byHour,
      hoursTotal: byHour.reduce((s, r) => s + r.games, 0),
      peakStartHour: settings.peakStartHour,
      stats: {
        month,
        todayGames: todays.length,
        gamesLeft: todays.filter((b) => endMs(b) > now).length,
        occupancy: Math.min(100, Math.round((bookedHours / openHours) * 100)),
        bookedHours,
        openHours,
        due: owing.reduce((s, b) => s + dueOf(b), 0),
        dueCount: owing.length,
      },
    };
  }, [db, now]);
}
