import type {
  Booking,
  PayMethod,
  RefundState,
  Settings,
  TurfDB,
} from "@/src/types";
import { startMs } from "./time";

export const paidOf = (b: Booking) =>
  b.payments.reduce(
    (s, p) => s + (p.kind === "refund" ? -p.amount : p.amount),
    0
  );
export const dueOf = (b: Booking) =>
  b.status === "cancelled" ? 0 : Math.max(0, b.total - paidOf(b));

/**
 * Money owed back to the customer: what a cancelled booking still holds (unless the venue kept it), or an
 * overpayment. Refunds are only given before kick-off — once the game's start time passes, nothing is owed.
 */
export const creditOf = (b: Booking, now: number) => {
  if (startMs(b) <= now) return 0;
  return b.status === "cancelled"
    ? b.refundWaived
      ? 0
      : Math.max(0, paidOf(b))
    : Math.max(0, paidOf(b) - b.total);
};

export const refundedOf = (b: Booking) =>
  b.payments.reduce((s, p) => s + (p.kind === "refund" ? p.amount : 0), 0);

/** Refund state of a cancelled booking, for the customer and the desk. */
export function refundState(b: Booking, now: number): RefundState {
  const owed = creditOf(b, now);
  if (owed > 0) return { kind: "owed", amount: owed };
  const back = refundedOf(b);
  if (back > 0) return { kind: "refunded", amount: back };
  // Kept on purpose, or the refund window closed at kick-off.
  return paidOf(b) > 0
    ? { kind: "kept", amount: paidOf(b) }
    : { kind: "none", amount: 0 };
}

/** Whether cancelling now is inside the free-cancellation window from Settings (full refund by default). */
export const freeToCancel = (b: Booking, settings: Settings, now: number) =>
  startMs(b) - now >= settings.cancelCutoffHours * 3600_000;

/** Whether a wallet transaction ID has already paid for a booking — one transfer can't pay twice. */
export function trxUsed(db: TurfDB, method: PayMethod, ref: string) {
  return db.bookings.some((b) =>
    b.payments.some((p) => p.method === method && p.ref === ref)
  );
}
