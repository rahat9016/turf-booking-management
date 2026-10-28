"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { statusLabels, statusStyles, taka } from "@/src/lib/turf-store/format";
import { useT } from "@/src/lib/turf-store/i18n";
import { phaseOf, useNow } from "@/src/lib/turf-store/store";
import type { Booking, Phase } from "@/src/lib/turf-store/types";
import { cn } from "@/src/lib/utils";

export type MoneyIcon = "wallet" | "calendar" | "bill" | "refund" | "vault";

const moneyIcons: Record<MoneyIcon, { paths: string[]; taka: [number, number] }> = {
  wallet: {
    paths: ["M5 10h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z", "M8 10l11-4.5 2.5 4.5", "M27 15h-4.5a2.5 2.5 0 0 0 0 5H27"],
    taka: [13, 22],
  },
  calendar: {
    paths: ["M6 8h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z", "M5 13h22", "M11 5v5M21 5v5"],
    taka: [16, 23.5],
  },
  bill: {
    paths: ["M8 4h11l5 5v19l-2.5-1.5L19 28l-2.5-1.5L14 28l-2.5-1.5L9 28H8z", "M19 4v5h5"],
    taka: [16, 20.5],
  },
  refund: {
    paths: ["M7.5 11.5A10 10 0 1 1 6 18", "M4 7.5l3.5 4.5 4.5-3"],
    taka: [16.5, 20.5],
  },
  vault: {
    paths: ["M8 14h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V15a1 1 0 0 1 1-1z", "M11 14v-3.5a5 5 0 0 1 10 0V14"],
    taka: [16, 24.5],
  },
};

export function MoneyGlyph({ icon, className }: { icon: MoneyIcon; className?: string }) {
  const { paths, taka: [x, y] } = moneyIcons[icon];
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <text x={x} y={y} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor" stroke="none">
        ৳
      </text>
    </svg>
  );
}

/** Slices a list into pages; the page clamps itself when the list shrinks. */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  return {
    rows: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    pages,
    setPage,
    from: items.length ? (current - 1) * pageSize + 1 : 0,
    to: Math.min(current * pageSize, items.length),
    total: items.length,
  };
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !e.defaultPrevented && close.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        ref={panel}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-clip rounded-t-2xl bg-white shadow-2xl outline-none animate-in slide-in-from-bottom duration-200 sm:max-h-[90vh] sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95",
          wide ? "max-w-2xl" : "max-w-md",
          className
        )}
      >
        <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-4 pb-3.5 pt-5 sm:px-6 sm:pb-4 sm:pt-7">
          <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-neutral-200 sm:hidden" />
          <h2 className="min-w-0 truncate text-base font-semibold text-neutral-900 sm:text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 [scrollbar-gutter:stable] sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
      </div>
    </div>
  );
}

/** Admin panel route base. */
export const ADMIN = "/admin";

/** Keyboard focus ring shared by every admin control. */
export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

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
export const tableCardClass = "overflow-hidden rounded-md border border-neutral-200 bg-white";
export const cardClass = "rounded-md border border-neutral-200 bg-white";
export const linkClass = "font-medium text-emerald-700 hover:underline";
/** Toolbar control: search box and filter selects share this height and border. */
export const control = cn("h-10 rounded-md border border-neutral-300 bg-white text-sm text-neutral-800 transition hover:border-emerald-400", focusRing, "focus-visible:ring-offset-0");

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  const tr = useT();
  return (
    <label className={cn("block", className)}>
      <span className={labelClass}>{tr(label)}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-neutral-400">{tr(hint)}</span>}
    </label>
  );
}

/** Small titled group of fields inside a section. */
export function Group({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  const tr = useT();
  return (
    <fieldset className={cn("rounded-lg border border-neutral-200 p-3 sm:p-4", className)}>
      <legend className="-ml-1 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{tr(title)}</legend>
      {children}
    </fieldset>
  );
}

/** White header card at the top of a list page. */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  const tr = useT();
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 sm:mb-4 sm:px-5 sm:py-3.5">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">{tr(title)}</h1>
        {subtitle && <p className="mt-0.5 truncate text-[13px] text-neutral-600 sm:text-sm">{tr(subtitle)}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

/** Titled card used on detail pages. */
export function Panel({ title, icon: Icon, action, children, className }: { title: string; icon?: React.ComponentType<{ className?: string }>; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  const tr = useT();
  return (
    <section className={cn(cardClass, "p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
          {Icon && <Icon className="size-4.5 text-emerald-700" />}
          {tr(title)}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Label/value row with an icon, as on the hotel booking page. */
export function InfoRow({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  const tr = useT();
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-start gap-3 border-t border-neutral-100 py-3 text-sm first:border-t-0 sm:grid-cols-[9rem_1fr]">
      <dt className="flex items-center gap-2 text-neutral-500">
        <Icon className="size-4 shrink-0 text-neutral-400" />
        {tr(label)}
      </dt>
      <dd className="min-w-0 text-neutral-900">{children}</dd>
    </div>
  );
}

const moneyTones = {
  green: { badge: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
  sky: { badge: "bg-sky-50 text-sky-600", bar: "bg-sky-500" },
  rose: { badge: "bg-rose-50 text-rose-600", bar: "bg-rose-500" },
  violet: { badge: "bg-violet-50 text-violet-600", bar: "bg-violet-500" },
  slate: { badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400" },
};

/** Money tile: ৳ icon on an animated backdrop (hover), the amount and one line of context. */
export function MoneyCard({ label, value, hint, icon, tone, index = 0, className }: { label: string; value: number; hint?: string; icon: MoneyIcon; tone: keyof typeof moneyTones; index?: number; className?: string }) {
  const t = moneyTones[tone];
  const tr = useT();
  return (
    <section className={cn("group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md sm:p-4", className)}>
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-0.5 opacity-70", t.bar)} />
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 pt-0.5 text-[13px] font-medium text-neutral-600 sm:pt-1">{tr(label)}</p>
        <span className={cn("relative flex size-10 shrink-0 items-center justify-center rounded-full sm:size-14", t.badge)}>
          <svg viewBox="0 0 56 56" aria-hidden className="absolute inset-0 size-full">
            <circle cx="28" cy="28" r="26" fill="currentColor" className="tw-ripple opacity-0" style={{ animationDelay: `${index * 300}ms` }} />
            <circle cx="28" cy="28" r="26" fill="currentColor" className="tw-ripple opacity-0" style={{ animationDelay: `${index * 300 + 1400}ms` }} />
            <circle cx="28" cy="28" r="25" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" className="tw-spin opacity-40" />
          </svg>
          <MoneyGlyph icon={icon} className="relative size-5 sm:size-7" />
        </span>
      </div>
      <p className="mt-auto pt-1.5 text-xl font-bold tabular-nums tracking-tight text-neutral-900 sm:pt-3 sm:text-2xl">{taka(value)}</p>
      {hint && <p className="mt-0.5 text-xs text-neutral-500 sm:text-[13px]">{tr(hint)}</p>}
    </section>
  );
}

const statusDots: Record<Phase, string> = {
  booked: "bg-emerald-500",
  playing: "bg-lime-500 animate-pulse",
  played: "bg-neutral-400",
  cancelled: "bg-rose-500",
};

export function StatusBadge({ booking, className }: { booking: Booking; className?: string }) {
  const phase = phaseOf(booking, useNow(30_000));
  const tr = useT();
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", statusStyles[phase], className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", statusDots[phase])} />
      {tr(statusLabels[phase])}
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800">
      {initials(name)}
    </span>
  );
}

export function Empty({ icon: Icon, title, text, children }: { icon: React.ComponentType<{ className?: string }>; title: string; text?: string; children?: React.ReactNode }) {
  const tr = useT();
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <Icon className="size-8 text-neutral-300" />
      <p className="font-medium text-neutral-800">{tr(title)}</p>
      {text && <p className="max-w-sm text-sm text-neutral-500">{tr(text)}</p>}
      {children}
    </div>
  );
}

/** Underlined tab strip with counts, used at the top of table and editor cards. */
export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: { value: T; label: string; count?: number; dot?: string }[] }) {
  const tr = useT();
  return (
    <div role="tablist" className="flex overflow-x-auto border-b border-neutral-100 px-1 [scrollbar-width:none] sm:gap-1 sm:px-3">
      {tabs.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.value)}
            className={cn("relative flex shrink-0 items-center gap-1.5 px-2.5 py-3.5 text-sm font-medium transition sm:gap-2 sm:px-3", selected ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800")}
          >
            {t.dot && <span className={cn("size-2 rounded-full", t.dot)} />}
            {tr(t.label)}
            {t.count !== undefined && (
              <span className={cn("rounded-md px-1.5 text-[11px] tabular-nums", selected ? "bg-emerald-700 text-white" : "bg-neutral-100 text-neutral-500")}>{t.count}</span>
            )}
            {selected && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600" />}
          </button>
        );
      })}
    </div>
  );
}

/** Row of rounded view pills; `group` changes insert a thin divider, and only views with a count show one. */
export function ViewPills<T extends string>({ value, onChange, views, label }: { value: T; onChange: (v: T) => void; views: { value: T; label: string; count?: number; group: number }[]; label: string }) {
  const tr = useT();
  return (
    <div role="group" aria-label={tr(label)} className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-100 p-3 [scrollbar-width:none] sm:flex-wrap sm:px-4">
      {views.map((v, i) => {
        const selected = value === v.value;
        return (
          <span key={v.value} className="contents">
            {i > 0 && views[i - 1].group !== v.group && <span aria-hidden className="mx-0.5 h-6 w-px shrink-0 bg-neutral-200" />}
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(v.value)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-sm font-medium transition",
                focusRing,
                selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:text-emerald-800"
              )}
            >
              {tr(v.label)}
              {v.count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 rounded-full px-1.5 text-center text-[13px] font-semibold tabular-nums leading-5",
                    selected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-700"
                  )}
                >
                  {v.count}
                </span>
              )}
            </button>
          </span>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  const tr = useT();
  return (
    <label className={cn("relative block min-w-0 flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" aria-hidden />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={tr(placeholder)} aria-label={tr(placeholder)} className={cn(control, "w-full pl-9 pr-3 placeholder:text-neutral-500")} />
    </label>
  );
}

export function ToolbarSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  active,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  /** A filter that's narrowing the list gets the brand outline, so it's easy to spot. */
  active?: boolean;
}) {
  const tr = useT();
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{tr(label)}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={cn(control, "w-full appearance-none pl-3 pr-9 lg:w-auto", active && "border-emerald-500 bg-emerald-50 font-medium text-emerald-900")}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {tr(o.label)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" aria-hidden />
    </label>
  );
}

export function Pager({ page, pages, setPage, from, to, total, noun = "items" }: { page: number; pages: number; setPage: (n: number) => void; from: number; to: number; total: number; noun?: string }) {
  const tr = useT();
  if (!total) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 text-sm text-neutral-500">
      <p>
        <b className="text-neutral-800">{from}</b>–<b className="text-neutral-800">{to}</b> {tr("of")} <b className="text-neutral-800">{total}</b> {tr(noun)}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} aria-label={tr("Previous page")} className="flex size-8 items-center justify-center rounded-md border border-neutral-200 hover:border-emerald-400 disabled:opacity-40">
            <ChevronLeft className="size-4" />
          </button>
          {nums.map((n, i) => (
            <span key={n} className="flex items-center gap-1">
              {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-neutral-400">…</span>}
              <button
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={cn("size-8 rounded-md text-xs font-medium", n === page ? "bg-emerald-700 text-white" : "border border-neutral-200 hover:border-emerald-400")}
              >
                {n}
              </button>
            </span>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === pages} aria-label={tr("Next page")} className="flex size-8 items-center justify-center rounded-md border border-neutral-200 hover:border-emerald-400 disabled:opacity-40">
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Editor save bar: sticks to the bottom of the card and turns green once something has changed. */
export function SaveBar({ dirty, onSave, onDiscard }: { dirty: boolean; onSave: () => void; onDiscard: () => void }) {
  const tr = useT();
  return (
    <div
      className={cn(
        "sticky bottom-0 flex items-center justify-between gap-2 rounded-b-md border-t px-3 py-2.5 backdrop-blur sm:px-6 sm:py-3",
        dirty ? "border-emerald-200 bg-emerald-50/95" : "border-neutral-100 bg-white/95"
      )}
    >
      <p className={cn("min-w-0 truncate text-[13px] sm:text-sm", dirty ? "font-medium text-emerald-900" : "text-neutral-500")}>{dirty ? tr("You have unsaved changes.") : tr("All changes saved")}</p>
      <div className="flex shrink-0 gap-2">
        {dirty && (
          <button type="button" onClick={onDiscard} className={cn(abtn.outline, "bg-white")}>
            {tr("Discard")}
          </button>
        )}
        <button type="button" onClick={onSave} disabled={!dirty} className={abtn.primary}>
          <span className="sm:hidden">{tr("Save")}</span>
          <span className="hidden sm:inline">{tr("Save changes")}</span>
        </button>
      </div>
    </div>
  );
}

/** Dashed full-width "+ Add …" button under an editable list. */
export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
    >
      <Plus className="size-4" /> {children}
    </button>
  );
}
