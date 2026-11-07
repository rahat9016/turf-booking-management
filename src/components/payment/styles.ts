import type { OnlinePayMethod } from "@/src/types";

export const pickedTile = "border-emerald-900 ring-1 ring-emerald-900";
export const unpickedTile = "border-neutral-200 hover:border-emerald-700";

/** Logos on the "Pay with" tiles (files in /public/payments); sized so all of them fit a 320px phone. */
export const payLogos: Record<
  OnlinePayMethod,
  { src: string; w: number; h: number; cls: string }[]
> = {
  bkash: [{ src: "/payments/bkash.webp", w: 208, h: 96, cls: "h-7 sm:h-8" }],
  nagad: [{ src: "/payments/nagad.webp", w: 274, h: 96, cls: "h-7 sm:h-8" }],
  card: [
    { src: "/payments/visa.svg", w: 1000, h: 325, cls: "h-3 sm:h-3.5" },
    { src: "/payments/mastercard.svg", w: 1000, h: 618, cls: "h-4 sm:h-5" },
  ],
};
