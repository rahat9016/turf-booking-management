/** Booking-site button styles. */
export const tbtn = {
  lime: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-lime-400 px-5 text-sm font-semibold text-emerald-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50",
  green:
    "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
  outline:
    "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-emerald-600 hover:text-emerald-800 disabled:opacity-50",
  danger:
    "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50",
  icon: "inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-emerald-600 hover:text-emerald-800 disabled:opacity-40",
};

export const inputClass =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export const labelClass = "mb-1.5 block text-xs font-medium text-neutral-600";

/** Quick-pick day chips (hero quick-book card and admin slot picker). */
export const dayChip = {
  base: "flex h-14 min-w-0 flex-col items-center justify-center rounded-lg transition",
  on: "bg-emerald-800 text-white",
  off: "bg-neutral-100 text-neutral-800 hover:bg-emerald-50",
};
