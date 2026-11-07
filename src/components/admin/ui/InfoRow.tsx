"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import type { IconType } from "@/src/types";

/** Label/value row with an icon. */
export function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: ReactNode;
}) {
  const tr = useT();
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-start gap-3 border-t border-neutral-100 py-3 text-sm first:border-t-0 sm:grid-cols-[9rem_1fr]">
      <dt className="flex items-center gap-2 text-neutral-500">
        <Icon className="size-4 shrink-0 text-neutral-400" />
        {tr(label)}
      </dt>
      <dd className="min-w-0 text-neutral-900">{children}</dd>
    </div>
  );
}
