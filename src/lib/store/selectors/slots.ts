import { addDays, slotTime, todayYmd } from "@/src/lib/format";
import type {
  Booking,
  Conflict,
  Court,
  FindConflictOptions,
  Settings,
  SlotInfo,
  SlotRequest,
  TurfDB,
} from "@/src/types";
import { priceAt } from "./pricing";
import { endMs, startMs } from "./time";

/** Cancelled bookings free their slot; everything else keeps it. */
export const occupies = (b: Booking) => b.status !== "cancelled";

const overlaps = (aStart: number, aDur: number, bStart: number, bDur: number) =>
  aStart < bStart + bDur && bStart < aStart + aDur;

export const conflictMessage = (c: Conflict) =>
  ({
    booking: "Someone just booked this slot.",
    block: "This court is closed for that time.",
    hold: "Another player is paying for this slot right now.",
    past: "That time has already started.",
    closed: "The venue is closed at that time.",
    inactive: "This court is not taking bookings.",
  })[c.kind];

export function findConflict(
  db: TurfDB,
  req: SlotRequest,
  opts: FindConflictOptions = {}
): Conflict | null {
  const now = opts.now ?? Date.now();
  const court = db.courts.find((c) => c.id === req.courtId);
  if (!court || !court.active) return { kind: "inactive" };
  if (
    req.startHour < db.settings.openHour ||
    req.startHour + req.duration > db.settings.closeHour
  )
    return { kind: "closed" };
  if (!opts.allowPast && slotTime(req.date, req.startHour) <= now)
    return { kind: "past" };
  const booking = db.bookings.find(
    (b) =>
      b.id !== opts.ignoreBookingId &&
      occupies(b) &&
      b.courtId === req.courtId &&
      b.date === req.date &&
      overlaps(b.startHour, b.duration, req.startHour, req.duration)
  );
  if (booking) return { kind: "booking", booking };
  const block = db.blocks.find(
    (b) =>
      b.courtId === req.courtId &&
      b.date === req.date &&
      overlaps(b.startHour, b.duration, req.startHour, req.duration)
  );
  if (block) return { kind: "block", block };
  const hold = db.holds.find(
    (h) =>
      h.expiresAt > now &&
      h.clientId !== opts.clientId &&
      h.courtId === req.courtId &&
      h.date === req.date &&
      overlaps(h.startHour, h.duration, req.startHour, req.duration)
  );
  if (hold) return { kind: "hold", hold };
  return null;
}

/** State of the one-hour cell `hour` on a court. */
export function slotInfo(
  db: TurfDB,
  court: Court,
  date: string,
  hour: number,
  now: number,
  clientId: string
): SlotInfo {
  const booking = db.bookings.find(
    (b) =>
      occupies(b) &&
      b.courtId === court.id &&
      b.date === date &&
      hour >= b.startHour &&
      hour < b.startHour + b.duration
  );
  if (booking) return { kind: "booked", booking };
  const block = db.blocks.find(
    (b) =>
      b.courtId === court.id &&
      b.date === date &&
      hour >= b.startHour &&
      hour < b.startHour + b.duration
  );
  if (block) return { kind: "blocked", block };
  if (slotTime(date, hour) <= now) return { kind: "past" };
  const hold = db.holds.find(
    (h) =>
      h.expiresAt > now &&
      h.courtId === court.id &&
      h.date === date &&
      hour >= h.startHour &&
      hour < h.startHour + h.duration
  );
  if (hold) return { kind: "held", hold, mine: hold.clientId === clientId };
  return { kind: "free", price: priceAt(court, hour, db.settings) };
}

/** Whether a cell can be picked: free, or the customer's own hold. */
export const isPickable = (info: SlotInfo) =>
  info.kind === "free" || (info.kind === "held" && info.mine);

export function hoursOf(settings: Settings) {
  return Array.from(
    { length: settings.closeHour - settings.openHour },
    (_, i) => settings.openHour + i
  );
}

/** Free one-hour slots left on a court for a date (ignoring the past). */
export function freeSlots(db: TurfDB, court: Court, date: string, now: number) {
  return hoursOf(db.settings).filter(
    (h) => slotInfo(db, court, date, h, now, "").kind === "free"
  ).length;
}

/** First day in the booking window with a free slot on a court, and that day's free start hours. */
export function nextFreeDay(db: TurfDB, court: Court, now: number) {
  const today = todayYmd();
  for (let i = 0; i < db.settings.bookingWindowDays; i++) {
    const date = addDays(today, i);
    const hours = hoursOf(db.settings).filter(
      (h) => slotInfo(db, court, date, h, now, "").kind === "free"
    );
    if (hours.length) return { date, hours };
  }
  return null;
}

/** The venue's one ground: the first active court. */
export const groundOf = (db: TurfDB) => db.courts.find((c) => c.active);

/** The booking being played on a court right now, if any, and the next one today. */
export function courtLive(db: TurfDB, courtId: string, now: number) {
  const today = todayYmd();
  const list = db.bookings
    .filter((b) => b.courtId === courtId && b.date === today && occupies(b))
    .sort((a, b) => a.startHour - b.startHour);
  const current = list.find((b) => startMs(b) <= now && endMs(b) > now);
  const next = list.find((b) => startMs(b) > now);
  return { current, next };
}
