import { cn } from "@/src/lib/utils";

/** Keyboard focus ring shared by every admin control. */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

export const abtn = {
  primary: `inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  dark: `inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  outline: `inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-emerald-400 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  danger: `inline-flex h-10 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-4 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  small: `inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 transition hover:border-emerald-400 hover:text-emerald-800 disabled:opacity-50 ${focusRing}`,
  icon: `inline-flex size-8 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30 ${focusRing}`,
  iconDanger: `inline-flex size-8 items-center justify-center rounded-md text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600 ${focusRing}`,
};

export const inputClass =
  "h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-neutral-50 disabled:text-neutral-500";
export const textareaClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
export const labelClass = "mb-1 block text-xs font-medium text-neutral-600";
export const tableCardClass =
  "overflow-hidden rounded-md border border-neutral-200 bg-white";
export const cardClass = "rounded-md border border-neutral-200 bg-white";
export const linkClass = "font-medium text-emerald-700 hover:underline";
/** Toolbar control: search box and filter selects share this height and border. */
export const control = cn(
  "h-10 rounded-md border border-neutral-300 bg-white text-sm text-neutral-800 transition hover:border-emerald-400",
  focusRing,
  "focus-visible:ring-offset-0"
);

/** Table header row and cells shared by the admin tables. */
export const table = {
  thead:
    "border-b border-neutral-200 bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500",
  th: "px-3 py-2.5 first:pl-4 last:pr-4",
  td: "px-3 py-3 first:pl-4 last:pr-4",
  row: "cursor-pointer transition hover:bg-neutral-50",
};
