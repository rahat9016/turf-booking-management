import { taka } from "@/src/lib/format";
import { cn } from "@/src/lib/utils";
import type { Payment } from "@/src/types";

/** Amount of one payment; refunds in violet with a minus sign. */
export function PaymentAmount({
  p,
  className,
}: {
  p: Payment;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        p.kind === "refund" ? "text-violet-700" : "text-neutral-900",
        className
      )}
    >
      {p.kind === "refund" ? "−" : ""}
      {taka(p.amount)}
    </span>
  );
}
