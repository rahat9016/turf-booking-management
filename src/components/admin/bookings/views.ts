import type { Booking } from "@/src/types";

export type BookingView = "all" | "today" | "upcoming" | "past" | "cancelled";

export const BOOKING_VIEWS: {
  value: BookingView;
  label: string;
  group: number;
}[] = [
  { value: "all", label: "All", group: 0 },
  { value: "today", label: "Today", group: 0 },
  { value: "upcoming", label: "Upcoming", group: 1 },
  { value: "past", label: "Past", group: 1 },
  { value: "cancelled", label: "Cancelled", group: 1 },
];

export function inView(b: Booking, v: BookingView, today: string) {
  const live = b.status !== "cancelled";
  if (v === "today") return live && b.date === today;
  if (v === "upcoming") return live && b.date > today;
  if (v === "past") return live && b.date < today;
  if (v === "cancelled") return !live;
  return true;
}
