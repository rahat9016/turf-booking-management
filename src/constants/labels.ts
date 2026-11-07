import type {
  BookingSource,
  PaymentKind,
  PayMethod,
  Phase,
  Sport,
} from "@/src/types";

export const sportLabels: Record<Sport, string> = {
  football: "Football",
};

export const statusLabels: Record<Phase, string> = {
  booked: "Booked",
  playing: "Playing now",
  played: "Played",
  cancelled: "Cancelled",
};

export const statusStyles: Record<Phase, string> = {
  booked: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  playing: "bg-lime-100 text-lime-800 ring-lime-300",
  played: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  cancelled: "bg-red-50 text-red-600 ring-red-200",
};

export const payLabels: Record<PayMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card",
  cash: "Cash",
};

export const sourceLabels: Record<BookingSource, string> = {
  online: "Online",
  "walk-in": "Walk-in",
  phone: "Phone",
};

export const paymentKindLabels: Record<PaymentKind, string> = {
  advance: "Advance",
  balance: "Balance",
  refund: "Refund",
};
