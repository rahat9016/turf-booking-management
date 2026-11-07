import { taka } from "@/src/lib/format";
import type { SlotInfo } from "@/src/types";

/** Colour of one cell on the courts × hours matrix. */
export function cellTone(info: SlotInfo, selected: boolean) {
  if (selected) return "bg-emerald-800 text-white ring-emerald-800";
  switch (info.kind) {
    case "free":
      return "bg-white text-neutral-800 ring-neutral-200 hover:ring-emerald-500 hover:bg-emerald-50";
    case "held":
      return info.mine
        ? "bg-emerald-800 text-white ring-emerald-800"
        : "bg-amber-50 text-amber-700 ring-amber-200";
    case "booked":
      return "bg-neutral-100 text-neutral-400 ring-neutral-100 line-through decoration-neutral-300";
    case "blocked":
      return "bg-[repeating-linear-gradient(45deg,#f5f5f5,#f5f5f5_6px,#ebebeb_6px,#ebebeb_12px)] text-neutral-400 ring-neutral-100";
    case "past":
      return "bg-neutral-50 text-neutral-300 ring-neutral-100";
  }
}

/** Short state of a cell for its tooltip and label. */
export const cellNote = (info: SlotInfo) =>
  info.kind === "free"
    ? taka(info.price)
    : info.kind === "held"
      ? info.mine
        ? "Yours"
        : "On hold"
      : info.kind === "booked"
        ? "Booked"
        : info.kind === "blocked"
          ? "Closed"
          : "Past";

/** Kick-off grid note for a cell that can't be picked. */
export const takenNote = (info: SlotInfo) =>
  info.kind === "blocked"
    ? "Closed"
    : info.kind === "held"
      ? "Being paid"
      : "Booked";
