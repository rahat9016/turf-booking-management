"use client";

import { ChevronDown } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { control } from "./styles";

export type SelectOption<T extends string> = { value: T; label: string };

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
  options: SelectOption<T>[];
  /** A filter that's narrowing the list gets the brand outline, so it's easy to spot. */
  active?: boolean;
}) {
  const tr = useT();
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{tr(label)}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          control,
          "w-full appearance-none pl-3 pr-9 lg:w-auto",
          active &&
            "border-indigo-500 bg-indigo-50 font-medium text-indigo-900"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {tr(o.label)}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
        aria-hidden
      />
    </label>
  );
}
