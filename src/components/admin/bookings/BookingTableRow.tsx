"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ROUTES, sourceLabels } from "@/src/constants";
import { dateLabel, rangeLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { Booking, Phase } from "@/src/types";
import { Avatar, focusRing, StatusBadge } from "../ui";
import { PayLine } from "./PayInfo";
import { RowAction } from "./RowAction";

/** Desktop table row; the whole row opens the booking. */
export function BookingTableRow({
  b,
  today,
  phase,
}: {
  b: Booking;
  today: string;
  phase: Phase;
}) {
  const t = useT();
  const router = useRouter();
  const href = ROUTES.adminBooking(b.id);
  return (
    <tr
      onClick={() => router.push(href)}
      className="group cursor-pointer transition hover:bg-neutral-50"
    >
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Avatar name={b.customer.name} />
          <div className="min-w-0">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "block truncate rounded-sm font-medium text-neutral-900 hover:text-indigo-800",
                focusRing
              )}
            >
              {b.customer.name}
            </Link>
            <p className="truncate text-xs text-neutral-500">
              <span className="font-mono">{b.code}</span> ·{" "}
              {t(sourceLabels[b.source])}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <p className="flex items-center gap-1.5 whitespace-nowrap text-neutral-900">
          {dateLabel(b.date)}
          {b.date === today && b.status !== "cancelled" && (
            <span className="rounded bg-indigo-50 px-1.5 text-[11px] font-medium text-indigo-700">
              {t("Today")}
            </span>
          )}
        </p>
        <p className="whitespace-nowrap text-xs text-neutral-500">
          {rangeLabel(b.startHour, b.duration)} ·{" "}
          {t(b.duration > 1 ? "{n} hrs" : "{n} hr", { n: b.duration })}
        </p>
      </td>
      <td className="px-3 py-3">
        <StatusBadge booking={b} />
      </td>
      <td className="px-3 py-3 text-right">
        <PayLine b={b} />
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center justify-end gap-2">
          <RowAction b={b} phase={phase} />
          <ChevronRight
            className="size-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-700"
            aria-hidden
          />
        </div>
      </td>
    </tr>
  );
}
