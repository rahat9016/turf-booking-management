"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BookingStatusBadge } from "@/src/components/common";
import { EASE, payLabels } from "@/src/constants";
import {
  dateLabel,
  formatDuration,
  hourLabel,
  rangeLabel,
  relativeDay,
  taka,
} from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { directionsUrl } from "@/src/lib/payment";
import { dueOf, endMs, paidOf, startMs, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { RefundNote } from "./RefundNote";

/** The featured booking, styled as a match ticket with a tear-off stub carrying the code. */
export function BookingTicket({ b, now }: { b: Booking; now: number }) {
  const db = useTurfDB();
  const tr = useT();
  const court = db.courts.find((c) => c.id === b.courtId);
  const until = startMs(b) - now;
  const live = until <= 0 && endMs(b) > now && b.status !== "cancelled";
  const paid = paidOf(b);
  const due = dueOf(b);
  const ended = endMs(b) <= now;

  return (
    <article className="relative grid overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200 md:grid-cols-[1fr_15rem]">
      <div className="p-6 md:p-8">
        {/* Status and countdown only matter until the game is over. */}
        {!ended && (
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <BookingStatusBadge booking={b} />
            {b.status !== "cancelled" ? (
              <span className="text-sm font-medium text-emerald-700">
                {live
                  ? tr("Playing now")
                  : tr("Kick-off in {time}", { time: formatDuration(until) })}
              </span>
            ) : (
              <RefundNote b={b} now={now} />
            )}
          </div>
        )}
        <p className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          {relativeDay(b.date) === dateLabel(b.date)
            ? dateLabel(b.date, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : `${tr(relativeDay(b.date))}, ${dateLabel(b.date, { day: "numeric", month: "long" })}`}
        </p>
        <p className="mt-1 text-xl text-neutral-700">
          {rangeLabel(b.startHour, b.duration)}{" "}
          <span className="text-neutral-400">·</span>{" "}
          {tr(b.duration > 1 ? "{n} hrs" : "{n} hr", { n: b.duration })}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {court ? tr(court.name) : tr("Ground")}
          {court && ` · ${tr(court.size.split(" · ")[0])}`}
          {b.customer.team && ` · ${b.customer.team}`}
        </p>

        <dl className="mt-6 grid grid-cols-3 border-t border-neutral-200 pt-4 text-sm">
          <div>
            <dt className="text-neutral-500">{tr("Total")}</dt>
            <dd className="mt-0.5 font-semibold text-neutral-900">
              {taka(b.total)}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">{tr("Paid")}</dt>
            <dd className="mt-0.5 font-semibold text-neutral-900">
              {taka(paid)}
              {b.payments[0] && (
                <span className="font-normal text-neutral-500">
                  {" "}
                  · {tr(payLabels[b.payments[0].method])}
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">{tr("Due at venue")}</dt>
            <dd
              className={cn(
                "mt-0.5 font-semibold",
                due > 0 ? "text-orange-600" : "text-emerald-700"
              )}
            >
              {due > 0 ? taka(due) : tr("Nothing")}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <a
            href={directionsUrl(db.settings.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
          >
            {tr("Get directions")} <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      <TicketStub code={b.code} startHour={b.startHour} />
    </article>
  );
}

/** Tear-off stub: slides in after the ticket lands. */
function TicketStub({ code, startHour }: { code: string; startHour: number }) {
  const tr = useT();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
      className="relative flex flex-col items-center justify-center gap-1 border-t-2 border-dashed border-neutral-200 bg-emerald-950 p-6 text-center text-white md:border-l-2 md:border-t-0"
    >
      <span className="absolute -left-3 -top-3 hidden size-6 rounded-full bg-neutral-50 md:block" />
      <span className="absolute -bottom-3 -left-3 hidden size-6 rounded-full bg-neutral-50 md:block" />
      <p className="text-xs uppercase tracking-[0.16em] text-white/50">
        {tr("Booking code")}
      </p>
      <p className="font-mono text-3xl font-semibold tracking-wider text-white">
        {code}
      </p>
      <p className="mt-2 text-xs text-white/60">
        {tr("Show this at the front desk")}
      </p>
      <p className="mt-4 text-xs text-white/50">
        {tr("Kick-off {time}", { time: hourLabel(startHour) })}
      </p>
    </motion.div>
  );
}
