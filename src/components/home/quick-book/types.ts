import type { Court } from "@/src/types";

/** Result of checking the visitor's pick: bookable (with the price), or why not and what to try instead. */
export type QuickCheck =
  | { ok: true; court: Court; total: number; advance: number }
  | { ok: false; message: string; fits: number; next: number | undefined };
