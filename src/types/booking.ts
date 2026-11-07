/**
 * Book, pay the booking money, play — no check-in and no verification step: a booking is confirmed the
 * moment it's made. Whether it's still to come, under way or played follows from the clock (see `phaseOf`).
 */
export type BookingStatus = "confirmed" | "cancelled";

/** What a booking shows as: its status, with confirmed games split by time. */
export type Phase = "booked" | "playing" | "played" | "cancelled";

export type PayMethod = "bkash" | "nagad" | "card" | "cash";

/** Methods a customer can use online — cash is only taken at the desk. */
export type OnlinePayMethod = Exclude<PayMethod, "cash">;

export type PaymentKind = "advance" | "balance" | "refund";

export type Payment = {
  id: string;
  amount: number;
  method: PayMethod;
  kind: PaymentKind;
  ref?: string;
  at: string;
};

export type BookingSource = "online" | "walk-in" | "phone";

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  team?: string;
};

export type Booking = {
  id: string;
  code: string;
  courtId: string;
  /** Local date, yyyy-mm-dd. */
  date: string;
  startHour: number;
  /** Whole hours. */
  duration: number;
  customer: Customer;
  total: number;
  advanceDue: number;
  payments: Payment[];
  status: BookingStatus;
  source: BookingSource;
  note?: string;
  cancelReason?: string;
  /** The venue cancelled but kept the money (a late cancellation), so nothing is owed back. */
  refundWaived?: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Admin-made closure of a court for part of a day (maintenance, tournament …). */
export type Block = {
  id: string;
  courtId: string;
  date: string;
  startHour: number;
  duration: number;
  reason: string;
};

/** Short-lived lock taken while a customer is on the payment step. */
export type Hold = {
  id: string;
  courtId: string;
  date: string;
  startHour: number;
  duration: number;
  clientId: string;
  expiresAt: number;
};

/** Refund state of a cancelled booking, for the customer and the desk. */
export type RefundState = {
  kind: "owed" | "refunded" | "kept" | "none";
  amount: number;
};
