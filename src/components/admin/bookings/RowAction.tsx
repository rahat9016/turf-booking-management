"use client";

import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { dueOf } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking, Phase } from "@/src/types";
import { focusRing } from "../ui";

const collectBtn = cn(
  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold shadow-sm transition active:scale-[0.98]",
  focusRing,
  "border border-neutral-300 bg-white text-neutral-800 shadow-none hover:border-emerald-400 hover:text-emerald-800"
);

/** The one thing the desk most likely wants to do next: take the rest of the money at the ground. */
export function RowAction({ b, phase }: { b: Booking; phase: Phase }) {
  const t = useT();
  const router = useRouter();
  // The balance is paid at the ground, so collecting is offered once the game has started.
  if ((phase !== "playing" && phase !== "played") || dueOf(b) <= 0) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`${ROUTES.adminBooking(b.id)}?do=pay`);
      }}
      className={collectBtn}
    >
      <Wallet className="size-3.5" aria-hidden /> {t("Collect")}
    </button>
  );
}
