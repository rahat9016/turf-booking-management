"use client";

import type { ReactNode } from "react";
import { useT } from "@/src/lib/i18n";
import type { IconType } from "@/src/types";

/** Centred icon, title and text for an empty list. */
export function Empty({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: IconType;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  const tr = useT();
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <Icon className="size-8 text-neutral-300" />
      <p className="font-medium text-neutral-800">{tr(title)}</p>
      {text && <p className="max-w-sm text-sm text-neutral-500">{tr(text)}</p>}
      {children}
    </div>
  );
}
