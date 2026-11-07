"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Wallet } from "lucide-react";
import { payLabels } from "@/src/constants";
import { usePagination } from "@/src/hooks";
import { formatDateTime } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { Empty, Pager, table } from "../ui";
import { KindTag } from "./KindTag";
import { PaymentAmount } from "./PaymentAmount";
import { bookingHref, layout, shortDay, shortTime, type Txn } from "./utils";

/** Every payment and refund, newest first. */
export function TransactionsTab({ txns }: { txns: Txn[] }) {
  const t = useT();
  const router = useRouter();
  const page = usePagination(txns, 20);
  if (txns.length === 0) return <Empty icon={Wallet} title="No payments" />;

  return (
    <>
      <ul className={layout.phoneList}>
        {page.rows.map(({ p, b }) => (
          <li key={p.id}>
            <Link href={bookingHref(b)} className={layout.phoneRow}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-neutral-900">
                    {b.customer.name}
                  </p>
                  <PaymentAmount p={p} className="shrink-0" />
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-[13px] text-neutral-600">
                  <p className="truncate">
                    {formatDateTime(p.at)} · {t(payLabels[p.method])}
                  </p>
                  <KindTag kind={p.kind} />
                </div>
              </div>
              <ChevronRight
                className="size-4 shrink-0 text-neutral-300"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className={layout.wideTable}>
        <table className="w-full min-w-[680px] table-fixed text-sm">
          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[26%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="hidden w-[18%] lg:table-column" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className={table.thead}>
            <tr>
              <th className={table.th}>{t("Date")}</th>
              <th className={table.th}>{t("Booking")}</th>
              <th className={table.th}>{t("Type")}</th>
              <th className={table.th}>{t("Method")}</th>
              <th className={cn(table.th, "hidden lg:table-cell")}>
                {t("Reference")}
              </th>
              <th className={cn(table.th, "text-right")}>{t("Amount")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {page.rows.map(({ p, b }) => (
              <tr
                key={p.id}
                onClick={() => router.push(bookingHref(b))}
                className={table.row}
              >
                <td className={cn(table.td, "whitespace-nowrap")}>
                  <p className="text-neutral-900">{shortDay(p.at)}</p>
                  <p className="text-xs text-neutral-500">{shortTime(p.at)}</p>
                </td>
                <td className={table.td}>
                  <p className="truncate font-medium text-neutral-900">
                    {b.customer.name}
                  </p>
                  <p className="font-mono text-xs text-neutral-500">{b.code}</p>
                </td>
                <td className={table.td}>
                  <KindTag kind={p.kind} />
                </td>
                <td className={cn(table.td, "text-neutral-700")}>
                  {t(payLabels[p.method])}
                </td>
                <td
                  className={cn(
                    table.td,
                    "hidden truncate font-mono text-xs text-neutral-500 lg:table-cell"
                  )}
                >
                  {p.ref ?? "—"}
                </td>
                <td className={cn(table.td, "text-right")}>
                  <PaymentAmount p={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager {...page} noun="payments" />
    </>
  );
}
