"use client";

import type { ReactNode } from "react";
import { Clock, Users } from "lucide-react";
import { clockRange, dateLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";

/** Dark match ticket shared by both steps: day, time and length above the perforation, the step's totals and button below. */
export function MatchTicket({
  day,
  start,
  duration,
  children,
}: {
  day: string;
  start: number | null;
  duration: number;
  children: ReactNode;
}) {
  const tr = useT();
  return (
    <aside className="relative rounded-lg bg-emerald-950 p-5 text-white lg:sticky lg:top-28 md:p-8">
      <svg
        aria-hidden
        viewBox="0 0 150 110"
        className="absolute right-5 top-5 h-16 text-white/15 md:right-8 md:top-8 md:h-24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="1" y="1" width="148" height="108" />
        <path d="M75 1v108M1 30h22v50H1M149 30h-22v50h22" />
        <circle cx="75" cy="55" r="16" />
      </svg>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        {tr("Your match")}
      </p>
      <p className="mt-4 max-w-[14rem] text-fluid-4xl font-semibold leading-tight">
        {new Date(`${day}T00:00`).toLocaleDateString("en-GB", {
          weekday: "long",
        })}
        ,
        <br />
        {dateLabel(day, { day: "numeric", month: "long" })}
      </p>
      <p className="mt-6 flex items-center gap-4 text-fluid-3xl font-semibold">
        <Clock className="size-7 shrink-0 text-white/80" />
        {start === null ? (
          <span className="text-white/40">{tr("Pick a time")}</span>
        ) : (
          clockRange(start, start + duration)
        )}
      </p>
      <p className="mt-3 flex items-center gap-4 text-white/85">
        <Users className="size-7 shrink-0 text-white/60" />
        {tr(duration > 1 ? "{n} hours" : "{n} hour", { n: duration })} ·{" "}
        {tr("Entire ground")}
      </p>

      {/* Perforation */}
      <div className="relative -mx-5 my-7 border-t-2 border-dashed border-white/20 md:-mx-8">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-[#f7f6f1]" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-[#f7f6f1]" />
      </div>
      {children}
    </aside>
  );
}

/** Big lime call-to-action at the foot of the ticket. */
export const ticketButton =
  "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-lime-400 text-base font-semibold text-emerald-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40";
