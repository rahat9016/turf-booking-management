import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function Chip({
  active,
  onClick,
  children,
  dark,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition",
        active
          ? "bg-emerald-800 text-white"
          : dark
            ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20"
            : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:ring-emerald-500"
      )}
    >
      {children}
    </button>
  );
}
