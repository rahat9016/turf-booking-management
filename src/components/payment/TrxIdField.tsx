"use client";

import { CheckCircle2, ClipboardPaste } from "lucide-react";
import { payLabels, TRX_ID } from "@/src/constants";
import { plainT } from "@/src/lib/i18n";
import { parseTrxId } from "@/src/lib/payment";
import { cn } from "@/src/lib/utils";
import type { PayMethod, T } from "@/src/types";

/** Wallet transaction-ID field: accepts the bare ID or the whole SMS, with a Paste button and a tick once valid. */
export function TrxIdField({
  id,
  method,
  value,
  onChange,
  onCommit,
  error,
  inputClassName,
  labelClassName,
  t = plainT,
}: {
  id: string;
  method: PayMethod;
  value: string;
  onChange: (v: string) => void;
  /** Called on blur and after a paste — where the parent starts showing errors. */
  onCommit?: (v: string) => void;
  /** Shown instead of the hint; the parent decides when it's time to show it. */
  error?: string;
  inputClassName: string;
  labelClassName: string;
  t?: T;
}) {
  // Clipboard reads need a secure origin and, on some browsers, a one-time permission.
  const canPaste =
    typeof navigator !== "undefined" && !!navigator.clipboard?.readText;
  const valid = TRX_ID.test(value);
  const paste = async () => {
    try {
      const v = parseTrxId(await navigator.clipboard.readText());
      onChange(v);
      onCommit?.(v);
    } catch {}
  };
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {t("{method} transaction ID", { method: payLabels[method] })}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            inputClassName,
            "pr-20 font-medium tracking-wider placeholder:font-normal placeholder:tracking-normal"
          )}
          placeholder={t("e.g. {id}", {
            id: method === "bkash" ? "BJ74K3XQ2M" : "7A3F9K2L",
          })}
          value={value}
          onChange={(e) => onChange(parseTrxId(e.target.value))}
          onBlur={() => onCommit?.(value)}
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-invalid={!!error}
          aria-describedby={`${id}-hint`}
        />
        <span className="absolute inset-y-0 right-2 flex items-center">
          {valid && !error ? (
            <CheckCircle2
              className="mr-1.5 size-5 text-emerald-600"
              aria-label={t("Looks right")}
            />
          ) : (
            canPaste && (
              <button
                type="button"
                onClick={paste}
                className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                <ClipboardPaste className="size-3.5" /> {t("Paste")}
              </button>
            )
          )}
        </span>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600">{error}</p>
      ) : (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-neutral-500">
          {t("Paste the ID or the whole {method} SMS.", {
            method: payLabels[method],
          })}
        </p>
      )}
    </div>
  );
}
