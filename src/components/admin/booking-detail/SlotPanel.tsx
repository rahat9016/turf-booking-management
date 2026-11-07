"use client";

import {
  CalendarClock,
  CalendarDays,
  CircleDot,
  Clock,
  Hash,
  ReceiptText,
  Tag,
} from "lucide-react";
import { sourceLabels } from "@/src/constants";
import { dateLabel, rangeLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import type { Booking } from "@/src/types";
import { abtn, InfoRow, Panel, StatusBadge } from "../ui";

/** Code, status, date, time, price and source; reschedule while the game is still to come. */
export function SlotPanel({
  b,
  canReschedule,
  onReschedule,
}: {
  b: Booking;
  canReschedule: boolean;
  onReschedule: () => void;
}) {
  const t = useT();
  return (
    <Panel
      title="Slot"
      icon={CalendarDays}
      action={
        canReschedule && (
          <button onClick={onReschedule} className={abtn.small}>
            <CalendarClock className="size-3.5" /> {t("Reschedule")}
          </button>
        )
      }
    >
      <dl>
        <InfoRow icon={Hash} label="Booking">
          <span className="font-mono font-semibold text-emerald-800">
            {b.code}
          </span>
        </InfoRow>
        <InfoRow icon={CircleDot} label="Status">
          <StatusBadge booking={b} />
        </InfoRow>
        <InfoRow icon={CalendarDays} label="Date">
          {dateLabel(b.date, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </InfoRow>
        <InfoRow icon={Clock} label="Time">
          {rangeLabel(b.startHour, b.duration)} ·{" "}
          {t(b.duration > 1 ? "{n} hrs" : "{n} hr", { n: b.duration })}
        </InfoRow>
        <InfoRow icon={Tag} label="Price">
          {taka(b.total)}
        </InfoRow>
        <InfoRow icon={ReceiptText} label="Source">
          {t(sourceLabels[b.source])}
        </InfoRow>
      </dl>
    </Panel>
  );
}
