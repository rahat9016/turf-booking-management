import { slotTime } from "@/src/lib/format";
import type { Booking, Phase } from "@/src/types";

export const startMs = (b: Pick<Booking, "date" | "startHour">) =>
  slotTime(b.date, b.startHour);
export const endMs = (b: Pick<Booking, "date" | "startHour" | "duration">) =>
  slotTime(b.date, b.startHour + b.duration);

export function phaseOf(b: Booking, now: number): Phase {
  if (b.status === "cancelled") return "cancelled";
  if (endMs(b) <= now) return "played";
  return startMs(b) <= now ? "playing" : "booked";
}
