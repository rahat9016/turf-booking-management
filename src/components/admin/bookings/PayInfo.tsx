"use client";

import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { dueOf, paidOf } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";

/** Phone list: amount due, or the total when fully paid. */
export function PayShort({ b }: { b: Booking }) {
  const t = useT();
  const due = dueOf(b);
  if (due > 0)
    return (
      <span className="shrink-0 font-medium tabular-nums text-red-700">
        {t("{amount} due", { amount: taka(due) })}
      </span>
    );
  return (
    <span className="shrink-0 tabular-nums text-neutral-500">
      {taka(b.total)}
    </span>
  );
}

/** Table: total and one plain line on what's owed. */
export function PayLine({ b }: { b: Booking }) {
  const t = useT();
  const due = dueOf(b);
  const paid = paidOf(b);
  const [text, tone] =
    b.status === "cancelled"
      ? [
          paid > 0
            ? t("{amount} kept", { amount: taka(paid) })
            : t("No charge"),
          "text-neutral-600",
        ]
      : due === 0
        ? [t("Paid in full"), "text-emerald-700"]
        : paid > 0
          ? [t("{amount} due", { amount: taka(due) }), "text-red-700"]
          : [t("Not paid"), "text-red-700"];
  return (
    <div className="whitespace-nowrap">
      <p className="font-medium tabular-nums text-neutral-900">
        {taka(b.total)}
      </p>
      <p className={cn("text-xs tabular-nums", tone)}>{text}</p>
    </div>
  );
}
