"use client";

import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { refundState } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";

/** What happened to the money on a cancelled booking. */
export function RefundNote({
  b,
  now,
  className,
}: {
  b: Booking;
  now: number;
  className?: string;
}) {
  const tr = useT();
  const r = refundState(b, now);
  const text = {
    owed: tr("Refund of {amount} on its way", { amount: taka(r.amount) }),
    refunded: tr("{amount} refunded", { amount: taka(r.amount) }),
    kept: tr("No refund"),
    none: tr("Nothing was paid"),
  }[r.kind];
  return (
    <span
      className={cn(
        "text-sm font-medium",
        r.kind === "owed"
          ? "text-violet-700"
          : r.kind === "refunded"
            ? "text-emerald-700"
            : "text-neutral-500",
        className
      )}
    >
      {text}
    </span>
  );
}
