export type Settings = {
  venueName: string;
  phone: string;
  address: string;
  /** First bookable hour (0–23). */
  openHour: number;
  /** Hour the venue closes; the last slot starts at closeHour − 1. Up to 24 (midnight). */
  closeHour: number;
  /** Slots starting at or after this hour use the court's peak price. */
  peakStartHour: number;
  /** Share of the total the customer must pay online to lock a slot. */
  advancePercent: number;
  /** Minutes a slot stays reserved while a customer is paying. */
  holdMinutes: number;
  maxDuration: number;
  /** How many days ahead customers may book. */
  bookingWindowDays: number;
  /** Customers can cancel online up to this many hours before the start. */
  cancelCutoffHours: number;
};
