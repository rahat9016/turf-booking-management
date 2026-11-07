"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { EASE } from "@/src/constants";
import { hourLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { QuickCheck } from "./types";

/** "Available · ৳… total" or why the pick doesn't work, with a one-tap fix. */
export function AvailabilityNote({
  check,
  onDuration,
  onHour,
}: {
  check: QuickCheck;
  onDuration: (n: number) => void;
  onHour: (h: number) => void;
}) {
  const tr = useT();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      key={check.ok ? `ok-${check.court.id}` : "taken"}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm",
        check.ok ? "bg-lime-50 text-emerald-900" : "bg-red-50 text-red-700"
      )}
    >
      {check.ok ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 size-4 shrink-0" />
      )}
      {check.ok ? (
        <span>
          <b>{tr("Available")}</b> ·{" "}
          {tr("{total} total · {advance} advance to lock it", {
            total: taka(check.total),
            advance: taka(check.advance),
          })}
        </span>
      ) : (
        <span>
          {check.message}{" "}
          {check.fits ? (
            <button
              onClick={() => onDuration(check.fits)}
              className="font-semibold underline"
            >
              {tr("Book {n} hr", { n: check.fits })}
            </button>
          ) : (
            check.next !== undefined && (
              <button
                onClick={() => onHour(check.next!)}
                className="font-semibold underline"
              >
                {tr("Try {time}", { time: hourLabel(check.next) })}
              </button>
            )
          )}
        </span>
      )}
    </motion.div>
  );
}
