"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** Key for the kick-off grid: Available / Selected / Booked. */
export function SlotLegend({
  className,
  dotClassName = "size-3.5",
}: {
  className?: string;
  dotClassName?: string;
}) {
  const t = useT();
  const items = [
    { label: "Available", dot: "border border-neutral-300" },
    { label: "Selected", dot: "bg-lime-400" },
    { label: "Booked", dot: "bg-neutral-200" },
  ];
  return (
    <div
      className={cn("flex items-center text-xs text-neutral-600", className)}
    >
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={cn("rounded-full", dotClassName, i.dot)} />{" "}
          {t(i.label)}
        </span>
      ))}
    </div>
  );
}
