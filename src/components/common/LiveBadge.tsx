"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { LiveDot } from "./LiveDot";

export function LiveBadge({ now, dark }: { now: number; dark?: boolean }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        dark
          ? "bg-white/10 text-white ring-1 ring-white/15"
          : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
      )}
    >
      <LiveDot />
      {t("Live")}
      {now > 0 && (
        <span className="tabular-nums opacity-70">
          ·{" "}
          {new Date(now).toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </span>
      )}
    </span>
  );
}
