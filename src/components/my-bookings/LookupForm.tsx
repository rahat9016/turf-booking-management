"use client";

import type { FormEvent } from "react";
import { Phone, Search, Ticket as TicketIcon } from "lucide-react";
import { tbtn } from "@/src/components/common";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { LookupMode } from "./parseQuery";

const MODES: [LookupMode, string][] = [
  ["phone", "Mobile number"],
  ["code", "Booking code"],
];

/** Mobile-number / booking-code tabs and the search box. */
export function LookupForm({
  mode,
  onMode,
  input,
  onInput,
  error,
  autoFocus,
  onSubmit,
}: {
  mode: LookupMode;
  onMode: (m: LookupMode) => void;
  input: string;
  onInput: (v: string) => void;
  error: string;
  autoFocus: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  const tr = useT();
  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 text-left">
      <div
        role="tablist"
        aria-label={tr("Look up by")}
        className="mx-auto flex w-fit rounded-md bg-white/[0.07] p-1 ring-1 ring-white/10"
      >
        {MODES.map(([k, l]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={mode === k}
            onClick={() => onMode(k)}
            className={cn(
              "rounded px-5 py-2 text-sm font-medium transition",
              mode === k
                ? "bg-white text-emerald-950"
                : "text-white/70 hover:text-white"
            )}
          >
            {tr(l)}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-5 flex items-center gap-2 rounded-lg bg-white p-2 shadow-2xl shadow-black/30 ring-2 transition",
          error
            ? "ring-rose-400"
            : "ring-transparent focus-within:ring-white/40"
        )}
      >
        {mode === "phone" ? (
          <Phone className="ml-3 size-5 shrink-0 text-neutral-400" />
        ) : (
          <TicketIcon className="ml-3 size-5 shrink-0 text-neutral-400" />
        )}
        <input
          id="mb-q"
          autoFocus={autoFocus}
          aria-label={
            mode === "phone" ? tr("Mobile number") : tr("Booking code")
          }
          autoComplete={mode === "phone" ? "tel" : "off"}
          inputMode={mode === "phone" ? "tel" : "text"}
          className="h-14 min-w-0 flex-1 bg-transparent text-lg tracking-wide text-neutral-900 outline-none placeholder:text-neutral-400"
          placeholder={mode === "phone" ? "01XXXXXXXXX" : "TH-1042"}
          value={input}
          onChange={(e) => onInput(e.target.value.slice(0, 16))}
          aria-invalid={!!error}
          aria-describedby="mb-hint"
        />
        <button className={cn(tbtn.lime, "h-14 px-7 text-base")}>
          <Search className="size-4" /> {tr("Find")}
        </button>
      </div>
      <p
        id="mb-hint"
        className={cn(
          "mt-3 text-center text-sm",
          error ? "text-rose-300" : "text-white/50"
        )}
      >
        {error
          ? tr(error)
          : mode === "phone"
            ? tr("The number you entered when you booked.")
            : tr("Shown after you paid the advance — looks like TH-1042.")}
      </p>
    </form>
  );
}
