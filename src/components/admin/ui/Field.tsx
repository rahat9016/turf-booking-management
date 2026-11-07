"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { labelClass } from "./styles";

/** Label above a control, with an optional grey hint below. Label and hint are translated. */
export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  const tr = useT();
  return (
    <label className={cn("block", className)}>
      <span className={labelClass}>{tr(label)}</span>
      {children}
      {hint && (
        <span className="mt-1 block text-[11px] text-neutral-400">
          {tr(hint)}
        </span>
      )}
    </label>
  );
}
