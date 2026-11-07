"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { plainT } from "@/src/lib/i18n";
import type { T } from "@/src/types";

/** A value to type into the wallet app, with a copy button where the browser allows it. */
export function CopyRow({
  label,
  value,
  copy = value,
  t = plainT,
}: {
  label: string;
  value: string;
  copy?: string;
  t?: T;
}) {
  const [copied, setCopied] = useState(false);
  // Clipboard is only exposed on secure origins (not on a phone hitting the dev server by LAN IP).
  const canCopy = typeof navigator !== "undefined" && !!navigator.clipboard;
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="whitespace-nowrap text-neutral-500">{label}</dt>
      <dd className="flex items-center gap-1 whitespace-nowrap font-semibold tabular-nums text-neutral-900">
        {value}
        {canCopy && (
          <button
            type="button"
            aria-label={t("Copy {what}", { what: label.toLowerCase() })}
            onClick={() =>
              navigator.clipboard
                .writeText(copy)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => {})
            }
            className="flex size-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-white hover:text-emerald-800"
          >
            {copied ? (
              <Check className="size-4 text-emerald-700" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        )}
      </dd>
    </div>
  );
}
