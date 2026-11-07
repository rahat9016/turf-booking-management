"use client";

import { cn } from "@/src/lib/utils";
import { pickedTile, unpickedTile } from "./styles";

export type AmountOption<V> = { v: V; t: string; a: string };

/** Radio cards for how much is paid now, e.g. "30% advance ৳1,980" / "Full amount ৳6,600". */
export function AmountChoice<V extends string | boolean>({
  options,
  value,
  onChange,
  className,
}: {
  options: AmountOption<V>[];
  value: V;
  onChange: (v: V) => void;
  /** Grid columns; two side by side from tablet width unless overridden. */
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button
            type="button"
            key={String(o.v)}
            onClick={() => onChange(o.v)}
            aria-pressed={on}
            className={cn(
              "flex h-14 items-center gap-3 rounded-lg border px-4 text-left transition",
              on ? pickedTile : unpickedTile
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border",
                on ? "border-emerald-900" : "border-neutral-300"
              )}
            >
              {on && <span className="size-2 rounded-full bg-emerald-900" />}
            </span>
            <span className="flex-1 text-sm font-medium text-neutral-800">
              {o.t}
            </span>
            <span className="font-semibold tabular-nums text-neutral-900">
              {o.a}
            </span>
          </button>
        );
      })}
    </div>
  );
}
