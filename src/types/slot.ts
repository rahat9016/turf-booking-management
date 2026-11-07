import type {
  Block,
  Booking,
  BookingSource,
  Customer,
  Hold,
  OnlinePayMethod,
  PayMethod,
} from "./booking";

export type SlotRequest = {
  courtId: string;
  date: string;
  startHour: number;
  duration: number;
};

/** A slot request without the date, e.g. the selection highlighted on a one-day grid. */
export type SlotSelection = Omit<SlotRequest, "date">;

export type Conflict =
  | { kind: "booking"; booking: Booking }
  | { kind: "block"; block: Block }
  | { kind: "hold"; hold: Hold }
  | { kind: "past" }
  | { kind: "closed" }
  | { kind: "inactive" };

export type FindConflictOptions = {
  clientId?: string;
  ignoreBookingId?: string;
  now?: number;
  allowPast?: boolean;
};

export type SlotInfo =
  | { kind: "free"; price: number }
  | { kind: "past" }
  | { kind: "booked"; booking: Booking }
  | { kind: "blocked"; block: Block }
  | { kind: "held"; hold: Hold; mine: boolean };

export type Quote = { total: number; advance: number };

/** Outcome of a store action that can be refused. */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export type OnlineBookingInput = SlotRequest & {
  customer: Customer;
  method: OnlinePayMethod;
  amount: number;
  ref: string;
  note?: string;
};

export type AdminBookingInput = SlotRequest & {
  customer: Customer;
  source: Exclude<BookingSource, "online">;
  total: number;
  paid: number;
  method: PayMethod;
  /** Wallet transaction ID or card slip reference. */
  ref?: string;
  note?: string;
};
