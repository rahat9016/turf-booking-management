import { groundOf } from "@/src/lib/store";
import type { Settings, TurfDB } from "@/src/types";

export type SettingsTab = "hours" | "rules";

// Venue name, phone and address are edited on the Content page.
export const RULE_KEYS = [
  "openHour",
  "closeHour",
  "peakStartHour",
  "advancePercent",
  "holdMinutes",
  "maxDuration",
  "bookingWindowDays",
  "cancelCutoffHours",
] as const;
export type Rules = Pick<Settings, (typeof RULE_KEYS)[number]>;

/** Booking rules plus the ground's two prices — everything the Settings page edits. */
export function draftOf(db: TurfDB) {
  const g = groundOf(db);
  return {
    rules: Object.fromEntries(
      RULE_KEYS.map((k) => [k, db.settings[k]])
    ) as Rules,
    price: g?.price ?? 0,
    peakPrice: g?.peakPrice ?? 0,
  };
}

export type SettingsDraft = ReturnType<typeof draftOf>;
