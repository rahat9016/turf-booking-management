"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookingStatusBadge } from "@/src/components/common";
import { EASE } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { dateLabel, rangeLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { dueOf } from "@/src/lib/store";
import type { Booking } from "@/src/types";
import { RefundNote } from "./RefundNote";

/** One booking in the "More upcoming" / "Past" list. */
export function BookingRow({ b, index }: { b: Booking; index: number }) {
  const now = useNow(60_000);
  const tr = useT();
  const due = dueOf(b);
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.4),
        ease: EASE,
      }}
      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 md:grid-cols-[11rem_1fr_9rem_auto]"
    >
      <div>
        <p className="font-semibold text-neutral-900">{dateLabel(b.date)}</p>
        <p className="text-sm text-neutral-500">
          {rangeLabel(b.startHour, b.duration)}
        </p>
      </div>
      <div className="order-last col-span-2 flex flex-wrap items-center gap-3 md:order-none md:col-span-1">
        <BookingStatusBadge booking={b} />
        <span className="font-mono text-xs text-neutral-500">{b.code}</span>
      </div>
      {b.status === "cancelled" ? (
        <RefundNote b={b} now={now} className="font-normal max-md:hidden" />
      ) : (
        <p className="text-sm text-neutral-500 max-md:hidden">
          {due > 0
            ? tr("{amount} due at venue", { amount: taka(due) })
            : tr("Fully paid")}
        </p>
      )}
      <p className="text-right font-semibold text-neutral-900">
        {taka(b.total)}
      </p>
    </motion.li>
  );
}
