"use client";

import { paymentKindLabels } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { PaymentKind } from "@/src/types";

const kindBadge: Record<PaymentKind, string> = {
  advance: "bg-blue-50 text-blue-700",
  balance: "bg-emerald-50 text-emerald-700",
  refund: "bg-violet-50 text-violet-700",
};

export function KindTag({ kind }: { kind: PaymentKind }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold",
        kindBadge[kind]
      )}
    >
      {t(paymentKindLabels[kind])}
    </span>
  );
}
