"use client";

import { LayoutGrid, Rows3 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Court } from "@/src/types";

export type CourtView = "court" | "all";

const VIEWS = [
  { v: "court" as const, l: "One ground", i: Rows3 },
  { v: "all" as const, l: "All grounds", i: LayoutGrid },
];

/** Ground picker and one-ground / all-grounds toggle — only shown when the venue has more than one ground. */
export function CourtSwitcher({
  courts,
  courtId,
  onCourt,
  view,
  onView,
}: {
  courts: Court[];
  courtId: string;
  onCourt: (id: string) => void;
  view: CourtView;
  onView: (v: CourtView) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-6">
      <select
        aria-label="Ground"
        value={courtId}
        onChange={(e) => onCourt(e.target.value)}
        className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
      >
        {courts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex rounded-lg bg-neutral-100 p-1">
        {VIEWS.map((o) => (
          <button
            key={o.v}
            onClick={() => onView(o.v)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
              view === o.v
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500"
            )}
          >
            <o.i className="size-3.5" /> {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
