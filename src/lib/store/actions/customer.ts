import type {
  Booking,
  Hold,
  OnlineBookingInput,
  Result,
  SlotRequest,
} from "@/src/types";
import { nowIso, uid, update } from "../db";
import {
  conflictMessage,
  findConflict,
  quote,
  startMs,
  trxUsed,
} from "../selectors";

export function holdSlot(req: SlotRequest, clientId: string): Result<Hold> {
  let result: Result<Hold> = { ok: false, error: "Could not hold the slot." };
  update((s) => {
    const conflict = findConflict(s, req, { clientId });
    if (conflict) {
      result = { ok: false, error: conflictMessage(conflict) };
      return s;
    }
    const hold: Hold = {
      id: uid("hd"),
      ...req,
      clientId,
      expiresAt: Date.now() + s.settings.holdMinutes * 60_000,
    };
    result = { ok: true, value: hold };
    // A customer has one selection at a time.
    return {
      ...s,
      holds: [...s.holds.filter((h) => h.clientId !== clientId), hold],
    };
  });
  return result;
}

export function releaseHold(clientId: string) {
  update((s) => ({
    ...s,
    holds: s.holds.filter((h) => h.clientId !== clientId),
  }));
}

export function createOnlineBooking(
  input: OnlineBookingInput,
  clientId: string
): Result<Booking> {
  let result: Result<Booking> = { ok: false, error: "Booking failed." };
  update((s) => {
    const conflict = findConflict(s, input, { clientId });
    if (conflict) {
      result = { ok: false, error: conflictMessage(conflict) };
      return s;
    }
    if (input.method !== "card" && trxUsed(s, input.method, input.ref)) {
      result = {
        ok: false,
        error: "This transaction ID has already been used for a booking.",
      };
      return s;
    }
    const court = s.courts.find((c) => c.id === input.courtId)!;
    const { total, advance } = quote(
      court,
      input.startHour,
      input.duration,
      s.settings
    );
    if (input.amount < advance) {
      result = { ok: false, error: `Minimum advance is ৳${advance}.` };
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
      total,
      advanceDue: advance,
      payments: [
        {
          id: uid("p"),
          amount: Math.min(input.amount, total),
          method: input.method,
          kind: "advance",
          ref: input.ref,
          at,
        },
      ],
      status: "confirmed",
      source: "online",
      note: input.note,
      createdAt: at,
      updatedAt: at,
    };
    result = { ok: true, value: booking };
    return {
      ...s,
      bookings: [...s.bookings, booking],
      holds: s.holds.filter((h) => h.clientId !== clientId),
      seq: { ...s.seq, booking: seq },
    };
  });
  return result;
}

export function cancelByCustomer(code: string, phone: string): Result<Booking> {
  let result: Result<Booking> = { ok: false, error: "Booking not found." };
  update((s) => {
    const b = s.bookings.find(
      (x) => x.code === code && x.customer.phone === phone
    );
    if (!b) return s;
    if (b.status === "cancelled") {
      result = { ok: false, error: "This booking is already cancelled." };
      return s;
    }
    if (startMs(b) - Date.now() < s.settings.cancelCutoffHours * 3600_000) {
      result = {
        ok: false,
        error: `Online cancellation closes ${s.settings.cancelCutoffHours}h before kick-off. Please call us.`,
      };
      return s;
    }
    const next = {
      ...b,
      status: "cancelled" as const,
      cancelReason: "Cancelled by customer",
      updatedAt: nowIso(),
    };
    result = { ok: true, value: next };
    return {
      ...s,
      bookings: s.bookings.map((x) => (x.id === b.id ? next : x)),
    };
  });
  return result;
}
