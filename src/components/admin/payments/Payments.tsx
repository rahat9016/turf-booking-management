"use client";

import { useMemo, useState } from "react";
import { useNow } from "@/src/hooks";
import { addDays, slotTime, todayYmd } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { creditOf, dueOf, startMs, useTurfDB } from "@/src/lib/store";
import type { Booking, PayMethod } from "@/src/types";
import { MoneyCard, SearchInput, tableCardClass, Tabs } from "../ui";
import { BalanceTab } from "./BalanceTab";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionsTab } from "./TransactionsTab";
import { type KindFilter, net, type PaymentsTab, type Period } from "./utils";

export function Payments() {
  const t = useT();
  const count = (n: number, one: string, many: string) =>
    t(n === 1 ? one : many, { n });
  const db = useTurfDB();
  const [tab, setTab] = useState<PaymentsTab>("transactions");
  const [period, setPeriod] = useState<Period>("30");
  const [method, setMethod] = useState<"all" | PayMethod>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [q, setQ] = useState("");
  const today = todayYmd();

  const all = useMemo(
    () =>
      db.bookings
        .flatMap((b) => b.payments.map((p) => ({ p, b })))
        .sort((x, y) => y.p.at.localeCompare(x.p.at)),
    [db.bookings]
  );
  const owing = useMemo(
    () =>
      db.bookings
        .filter((b) => dueOf(b) > 0)
        .sort((a, b) => startMs(a) - startMs(b)),
    [db.bookings]
  );
  const now = useNow(60_000);
  // Refunds are given until kick-off, so the soonest games come first.
  const owedBack = useMemo(
    () =>
      db.bookings
        .filter((b) => creditOf(b, now) > 0)
        .sort((a, b) => startMs(a) - startMs(b)),
    [db.bookings, now]
  );

  const since = (days: number) => slotTime(addDays(today, 1 - days), 0);
  const todays = all.filter((x) => +new Date(x.p.at) >= since(1));
  const month = all.filter((x) => x.p.at.slice(0, 7) === today.slice(0, 7));

  const term = q.trim().toLowerCase();
  const match = (b: Booking, extra = "") =>
    !term ||
    [b.code, b.customer.name, b.customer.phone, extra].some((v) =>
      v.toLowerCase().includes(term)
    );
  const txns = all.filter(
    (x) =>
      (period === "all" ||
        +new Date(x.p.at) >= since(period === "today" ? 1 : Number(period))) &&
      (method === "all" || x.p.method === method) &&
      (kind === "all" || x.p.kind === kind) &&
      match(x.b, x.p.ref)
  );
  const dues = owing.filter((b) => match(b));
  const refunds = owedBack.filter((b) => match(b));

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MoneyCard
          label="Today"
          value={net(todays.map((x) => x.p))}
          hint={count(todays.length, "{n} payment", "{n} payments")}
          icon="wallet"
          tone="green"
          index={0}
        />
        <MoneyCard
          label="This month"
          value={net(month.map((x) => x.p))}
          hint={count(month.length, "{n} payment", "{n} payments")}
          icon="calendar"
          tone="sky"
          index={1}
        />
        <MoneyCard
          label="To collect"
          value={owing.reduce((s, b) => s + dueOf(b), 0)}
          hint={count(owing.length, "{n} booking", "{n} bookings")}
          icon="bill"
          tone="rose"
          index={2}
        />
        <MoneyCard
          label="To refund"
          value={owedBack.reduce((s, b) => s + creditOf(b, now), 0)}
          hint={count(owedBack.length, "{n} booking", "{n} bookings")}
          icon="refund"
          tone="violet"
          index={3}
        />
      </div>

      <div className={tableCardClass}>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            {
              value: "transactions",
              label: "Transactions",
              count: txns.length,
            },
            { value: "due", label: "Due", count: dues.length },
            {
              value: "refunds",
              label: "Refunds",
              count: refunds.length,
              dot: refunds.length ? "bg-violet-500" : undefined,
            },
          ]}
        />
        <div className="flex flex-col gap-2 border-b border-neutral-100 p-3 sm:p-4 lg:flex-row lg:items-center">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Search name, phone or code"
            className="lg:max-w-sm"
          />
          {tab === "transactions" && (
            <TransactionFilters
              period={period}
              onPeriod={setPeriod}
              method={method}
              onMethod={setMethod}
              kind={kind}
              onKind={setKind}
            />
          )}
        </div>

        {tab === "transactions" && <TransactionsTab txns={txns} />}
        {tab === "due" && (
          <BalanceTab variant="due" bookings={dues} now={now} />
        )}
        {tab === "refunds" && (
          <BalanceTab variant="refund" bookings={refunds} now={now} />
        )}
      </div>
    </div>
  );
}
