"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { IconType } from "@/src/types";
import { cardClass } from "./styles";

/** Titled card used on detail pages. */
export function Panel({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: IconType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const tr = useT();
  return (
    <section className={cn(cardClass, "p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
          {Icon && <Icon className="size-4.5 text-emerald-700" />}
          {tr(title)}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
