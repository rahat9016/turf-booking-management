"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReceiptText, Undo2, Wallet } from "lucide-react";
import { usePagination } from "@/src/hooks";
import { dateLabel, rangeLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { creditOf, dueOf, paidOf } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { abtn, Empty, Pager, StatusBadge, table } from "../ui";
import { bookingHref, layout } from "./utils";

type Variant = "due" | "refund";

const variants = {
  due: {
    icon: Wallet,
    emptyIcon: ReceiptText,
    empty: "Nothing due",
    action: "Collect",
    param: "pay",
    tone: "text-red-700",
  },
  refund: {
    icon: Undo2,
    emptyIcon: Undo2,
    empty: "No refunds owed",
    action: "Refund",
    param: "refund",
    tone: "text-violet-700",
  },
} as const;

/**
 * Bookings with money to settle: the balance still to collect (`due`) or money owed back (`refund`).
 * Both lists share a layout — slot, the amount, and a button straight to the payment form.
 */
export function BalanceTab({
  variant,
  bookings,
  now,
}: {
  variant: Variant;
  bookings: Booking[];
  now: number;
}) {
  const t = useT();
  const router = useRouter();
  const page = usePagination(bookings, 20);
  const v = variants[variant];
  const amountOf = (b: Booking) =>
    variant === "due" ? dueOf(b) : creditOf(b, now);
  if (bookings.length === 0)
    return <Empty icon={v.emptyIcon} title={v.empty} />;

  const action = (b: Booking, stop?: boolean) => (
    <Link
      href={`${bookingHref(b)}&do=${v.param}`}
      onClick={stop ? (e) => e.stopPropagation() : undefined}
      className={abtn.small}
    >
      <v.icon className="size-3.5" /> {t(v.action)}
    </Link>
  );

  // Middle column and the column before the amount differ per list.
  const extra: {
    head: string;
    cell: (b: Booking) => ReactNode;
    className: string;
  }[] =
    variant === "due"
      ? [
          {
            head: "Status",
            cell: (b) => <StatusBadge booking={b} />,
            className: "",
          },
          {
            head: "Total",
            cell: (b) => taka(b.total),
            className: "text-right tabular-nums",
          },
        ]
      : [
          {
            head: "Reason",
            cell: (b) =>
              b.status === "cancelled"
                ? (b.cancelReason ?? t("Cancelled"))
                : t("Overpaid"),
            className: "truncate text-neutral-600",
          },
          {
            head: "Paid",
            cell: (b) => taka(paidOf(b)),
            className: "text-right tabular-nums",
          },
        ];
  const cols =
    variant === "due"
      ? ["28%", "20%", "14%", "13%", "13%", "12%"]
      : ["26%", "20%", "18%", "12%", "12%", "12%"];

  return (
    <>
      <ul className={layout.phoneList}>
        {page.rows.map((b) => (
          <li key={b.id} className={layout.phoneRow}>
            <Link href={bookingHref(b)} className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-900">
                {b.customer.name}
              </p>
              <p className="mt-1 truncate text-[13px] text-neutral-600">
                {dateLabel(b.date)} · {rangeLabel(b.startHour, b.duration)}
              </p>
            </Link>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className={cn("font-semibold tabular-nums", v.tone)}>
                {taka(amountOf(b))}
              </span>
              {action(b)}
            </div>
          </li>
        ))}
      </ul>
      <div className={layout.wideTable}>
        <table className="w-full min-w-[680px] table-fixed text-sm">
          <colgroup>
            {cols.map((w, i) => (
              <col
                key={i}
                style={{ width: w }}
                className={i === 2 ? "hidden lg:table-column" : undefined}
              />
            ))}
          </colgroup>
          <thead className={table.thead}>
            <tr>
              <th className={table.th}>{t("Booking")}</th>
              <th className={table.th}>{t("Slot")}</th>
              <th className={cn(table.th, "hidden lg:table-cell")}>
                {t(extra[0].head)}
              </th>
              <th className={cn(table.th, "text-right")}>{t(extra[1].head)}</th>
              <th className={cn(table.th, "text-right")}>
                {t(variant === "due" ? "Due" : "To refund")}
              </th>
              <th className={table.th}>
                <span className="sr-only">{t("Actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {page.rows.map((b) => (
              <tr
                key={b.id}
                onClick={() => router.push(bookingHref(b))}
                className={table.row}
              >
                <td className={table.td}>
                  <p className="truncate font-medium text-neutral-900">
                    {b.customer.name}
                  </p>
                  <p className="font-mono text-xs text-neutral-500">{b.code}</p>
                </td>
                <td className={table.td}>
                  <p className="whitespace-nowrap">{dateLabel(b.date)}</p>
                  <p className="whitespace-nowrap text-xs text-neutral-500">
                    {rangeLabel(b.startHour, b.duration)}
                  </p>
                </td>
                <td
                  className={cn(
                    table.td,
                    "hidden lg:table-cell",
                    extra[0].className
                  )}
                >
                  {extra[0].cell(b)}
                </td>
                <td className={cn(table.td, extra[1].className)}>
                  {extra[1].cell(b)}
                </td>
                <td
                  className={cn(
                    table.td,
                    "text-right font-medium tabular-nums",
                    v.tone
                  )}
                >
                  {taka(amountOf(b))}
                </td>
                <td className={cn(table.td, "text-right")}>
                  {action(b, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager {...page} noun="bookings" />
    </>
  );
}
