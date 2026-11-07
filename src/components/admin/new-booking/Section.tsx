"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import { cardClass } from "../ui";

/** Numbered card section of the new-booking form. */
export function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <section className={cardClass}>
      <h2 className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5 font-semibold text-neutral-900 sm:px-5">
        <span className="flex size-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
          {n}
        </span>
        {t(title)}
      </h2>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
