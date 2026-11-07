"use client";

import { ArrowRight } from "lucide-react";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { ticketButton } from "../MatchTicket";

/** Ticket body on the payment step: the ground's price, what is paid now and what is left for the ground. */
export function PaymentSummary({
  courtName,
  total,
  amount,
  busy,
}: {
  courtName: string;
  total: number;
  amount: number;
  busy: boolean;
}) {
  const tr = useT();
  return (
    <>
      <dl className="text-sm">
        <div className="flex justify-between gap-3 py-1.5">
          <dt className="text-white/80">{tr(courtName)}</dt>
          <dd className="tabular-nums">{taka(total)}</dd>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-y border-white/10 py-4">
          <dt className="text-lg">{tr("Pay now")}</dt>
          <dd className="text-2xl font-semibold tabular-nums">
            {taka(amount)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-3.5">
          <dt className="text-white/80">{tr("Pay at ground")}</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {taka(total - amount)}
          </dd>
        </div>
      </dl>
      <button type="submit" disabled={busy} className={ticketButton}>
        {tr("Pay {amount} & book", { amount: taka(amount) })}{" "}
        <ArrowRight className="size-5" />
      </button>
    </>
  );
}
