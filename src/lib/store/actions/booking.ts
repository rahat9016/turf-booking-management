import type {
  AdminBookingInput,
  Booking,
  BookingStatus,
  PaymentKind,
  PayMethod,
  Result,
  SlotRequest,
} from "@/src/types";
import { nowIso, uid, update } from "../db";
import {
  advanceFor,
  conflictMessage,
  findConflict,
  trxUsed,
} from "../selectors";

/* Front-desk actions on bookings. */

function patchBooking(id: string, fn: (b: Booking) => Booking) {
  update((s) => ({
    ...s,
    bookings: s.bookings.map((b) =>
      b.id === id ? { ...fn(b), updatedAt: nowIso() } : b
    ),
  }));
}

export function setBookingStatus(
  id: string,
  status: BookingStatus,
  cancelReason?: string
) {
  patchBooking(id, (b) => ({
    ...b,
    status,
    cancelReason:
      status === "cancelled" ? cancelReason || b.cancelReason : b.cancelReason,
  }));
}

/** Cancel a booking; `keepMoney` means the venue keeps what was paid (no refund owed). */
export function cancelBooking(
  id: string,
  reason: string | undefined,
  keepMoney: boolean
) {
  patchBooking(id, (b) => ({
    ...b,
    status: "cancelled",
    cancelReason: reason,
    refundWaived: keepMoney || undefined,
  }));
}

export function addPayment(
  id: string,
  amount: number,
  method: PayMethod,
  kind: PaymentKind,
  ref?: string
) {
  patchBooking(id, (b) => ({
    ...b,
    payments: [
      ...b.payments,
      {
        id: uid("p"),
        amount,
        method,
        kind,
        ref: ref || undefined,
        at: nowIso(),
      },
    ],
  }));
}

export function createAdminBooking(input: AdminBookingInput): Result<Booking> {
  let result: Result<Booking> = { ok: false, error: "Booking failed." };
  update((s) => {
    // Staff may record a game that is already under way, so past start times are allowed.
    const conflict = findConflict(s, input, { allowPast: true });
    if (conflict) {
      result = { ok: false, error: conflictMessage(conflict) };
      return s;
    }
    if (
      input.ref &&
      (input.method === "bkash" || input.method === "nagad") &&
      trxUsed(s, input.method, input.ref)
    ) {
      result = {
        ok: false,
        error: "This transaction ID has already been used for a booking.",
      };
      return s;
    }
    const seq = s.seq.booking + 1;
    const at = nowIso();
    const booking: Booking = {
      id: uid("bk"),
      code: `TH-${seq}`,
      courtId: input.courtId,
      date: input.date,
      startHour: input.startHour,
      duration: input.duration,
      customer: input.customer,
      total: input.total,
      advanceDue: advanceFor(input.total, s.settings),
      payments:
        input.paid > 0
          ? [
              {
                id: uid("p"),
                amount: input.paid,
                method: input.method,
                kind: "advance",
                ref: input.ref || undefined,
                at,
              },
            ]
          : [],
      status: "confirmed",
      source: input.source,
      note: input.note,
      createdAt: at,
      updatedAt: at,
    };
    result = { ok: true, value: booking };
    return {
      ...s,
      bookings: [...s.bookings, booking],
      seq: { ...s.seq, booking: seq },
    };
  });
  return result;
}

export function rescheduleBooking(
  id: string,
  req: SlotRequest
): Result<Booking> {
  let result: Result<Booking> = { ok: false, error: "Booking not found." };
  update((s) => {
    const b = s.bookings.find((x) => x.id === id);
    if (!b) return s;
    const conflict = findConflict(s, req, { ignoreBookingId: id });
    if (conflict) {
      result = { ok: false, error: conflictMessage(conflict) };
      return s;
    }
    const next = { ...b, ...req, updatedAt: nowIso() };
    result = { ok: true, value: next };
    return { ...s, bookings: s.bookings.map((x) => (x.id === id ? next : x)) };
  });
  return result;
}
