"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";

/** White header card at the top of a list page. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  const tr = useT();
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 sm:mb-4 sm:px-5 sm:py-3.5">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          {tr(title)}
        </h1>
        {subtitle && (
          <p className="mt-0.5 truncate text-[13px] text-neutral-600 sm:text-sm">
            {tr(subtitle)}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      )}
    </div>
  );
}
