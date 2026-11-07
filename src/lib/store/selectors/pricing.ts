import type { Court, Quote, Settings } from "@/src/types";

export const priceAt = (court: Court, hour: number, settings: Settings) =>
  hour >= settings.peakStartHour ? court.peakPrice : court.price;

/** Advance owed on a total: `advancePercent` of it, rounded up to the next ৳10. */
export const advanceFor = (total: number, settings: Settings) =>
  Math.ceil((total * settings.advancePercent) / 100 / 10) * 10;

export function quote(
  court: Court,
  startHour: number,
  duration: number,
  settings: Settings
): Quote {
  let total = 0;
  for (let h = startHour; h < startHour + duration; h++)
    total += priceAt(court, h, settings);
  return { total, advance: advanceFor(total, settings) };
}
