import { ROUTES } from "@/src/constants";
import type { Booking, Payment, PaymentKind } from "@/src/types";

export type PaymentsTab = "transactions" | "due" | "refunds";
export type Period = "today" | "7" | "30" | "all";
export type KindFilter = "all" | PaymentKind;

/** A payment with the booking it belongs to. */
export type Txn = { p: Payment; b: Booking };

const signed = (p: Payment) => (p.kind === "refund" ? -p.amount : p.amount);
/** Money in minus refunds. */
export const net = (ps: Payment[]) => ps.reduce((s, p) => s + signed(p), 0);

// `from` lets the booking page send staff back here rather than to the bookings list.
export const bookingHref = (b: Booking) =>
  `${ROUTES.adminBooking(b.id)}?from=payments`;

/** "2 Nov" and "4:00 pm" on two lines, like the slot column on Bookings. */
export const shortDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const shortTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

/** Phones get a stacked list; the table starts at tablet width. */
export const layout = {
  phoneList: "divide-y divide-neutral-100 md:hidden",
  phoneRow:
    "flex items-center gap-3 px-4 py-3 transition active:bg-emerald-50/60",
  wideTable: "hidden overflow-x-auto md:block",
};
