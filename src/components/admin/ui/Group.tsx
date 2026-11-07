"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

/** Small titled group of fields inside a section. */
export function Group({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const tr = useT();
  return (
    <fieldset
      className={cn(
        "rounded-lg border border-neutral-200 p-3 sm:p-4",
        className
      )}
    >
      <legend className="-ml-1 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {tr(title)}
      </legend>
      {children}
    </fieldset>
  );
}
