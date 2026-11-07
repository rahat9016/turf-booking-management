"use client";

import { CalendarX, Undo2, Wallet } from "lucide-react";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { creditOf, dueOf, paidOf, phaseOf, refundState } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { abtn, cardClass } from "../ui";
import { BackButton } from "./BackButton";
import type { DetailModal } from "./types";

const refundRows = {
  owed: {
    label: "To refund",
    tone: "border-violet-100 bg-violet-50 text-violet-800",
  },
  refunded: {
    label: "Refunded",
    tone: "border-emerald-100 bg-emerald-50 text-emerald-800",
  },
  kept: {
    label: "Kept · no refund",
    tone: "border-neutral-100 bg-neutral-50 text-neutral-700",
  },
  none: {
    label: "Nothing paid",
    tone: "border-neutral-100 bg-neutral-50 text-neutral-700",
  },
};

/** Side card: total / paid / due (or refund state), and the next money action. */
export function MoneySummary({
  b,
  now,
  onOpen,
}: {
  b: Booking;
  now: number;
  onOpen: (m: DetailModal) => void;
}) {
  const t = useT();
  const paid = paidOf(b);
  const due = dueOf(b);
  const closed = b.status === "cancelled";
  const credit = creditOf(b, now);
  const refund = refundState(b, now);
  const refundRow = refundRows[refund.kind];

  return (
    <section className={cn(cardClass, "space-y-3 p-4")}>
      {closed && (
        <p className="rounded-md bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
          {t("Cancelled")}
          {b.cancelReason && <> — {b.cancelReason}</>}
        </p>
      )}
      <dl className="overflow-hidden rounded-md border border-neutral-200 text-sm">
        <div className="flex justify-between px-3 py-2.5">
          <dt className="text-neutral-600">{t("Total")}</dt>
          <dd className="tabular-nums">{taka(b.total)}</dd>
        </div>
        <div className="flex justify-between border-t border-neutral-100 px-3 py-2.5">
          <dt className="text-neutral-600">{t("Paid")}</dt>
          <dd className="tabular-nums text-emerald-700">{taka(paid)}</dd>
        </div>
        {closed ? (
          <div
            className={cn(
              "flex items-center justify-between border-t px-3 py-3 font-semibold",
              refundRow.tone
            )}
          >
            <dt>{t(refundRow.label)}</dt>
            <dd className="text-lg tabular-nums">{taka(refund.amount)}</dd>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "flex items-center justify-between border-t px-3 py-3 font-semibold",
                due > 0
                  ? "border-rose-100 bg-rose-50 text-rose-800"
                  : "border-emerald-100 bg-emerald-50 text-emerald-800"
              )}
            >
              <dt>{due > 0 ? t("Due") : t("Fully paid")}</dt>
              <dd className="text-lg tabular-nums">{taka(due)}</dd>
            </div>
            {/* Paid more than the price (e.g. a shorter game after rescheduling). */}
            {credit > 0 && (
              <div className="flex items-center justify-between border-t border-violet-100 bg-violet-50 px-3 py-3 font-semibold text-violet-800">
                <dt>{t("To refund")}</dt>
                <dd className="text-lg tabular-nums">{taka(credit)}</dd>
              </div>
            )}
          </>
        )}
      </dl>
      {/* The rest of the money is taken at the ground. */}
      {!closed && due > 0 && (
        <button
          onClick={() => onOpen("pay")}
          className={cn(abtn.primary, "w-full")}
        >
          <Wallet className="size-4" />{" "}
          {t("Collect {amount}", { amount: taka(due) })}
        </button>
      )}
      {phaseOf(b, now) === "booked" && (
        <button
          onClick={() => onOpen("cancel")}
          className={cn(abtn.danger, "w-full")}
        >
          <CalendarX className="size-4" /> {t("Cancel booking")}
        </button>
      )}
      {credit > 0 && (
        <button
          onClick={() => onOpen("refund")}
          className={cn(
            abtn.primary,
            "w-full bg-violet-700 hover:bg-violet-800"
          )}
        >
          <Undo2 className="size-4" />{" "}
          {t("Refund {amount}", { amount: taka(credit) })}
        </button>
      )}
      <BackButton />
    </section>
  );
}
