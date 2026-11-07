"use client";

import { Search } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { control } from "./styles";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  const tr = useT();
  return (
    <label className={cn("relative block min-w-0 flex-1", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tr(placeholder)}
        aria-label={tr(placeholder)}
        className={cn(control, "w-full pl-9 pr-3 placeholder:text-neutral-500")}
      />
    </label>
  );
}
