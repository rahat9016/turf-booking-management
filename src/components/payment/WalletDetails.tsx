"use client";

import { plainT } from "@/src/lib/i18n";
import { walletNumber } from "@/src/lib/payment";
import type { T } from "@/src/types";
import { CopyRow } from "./CopyRow";

/** "Send Money to" and "Amount" rows, both copyable. */
export function SendMoneyRows({
  to,
  toCopy = to,
  amount,
  amountLabel,
  t = plainT,
}: {
  to: string;
  toCopy?: string;
  amount: number;
  amountLabel: string;
  t?: T;
}) {
  return (
    <dl className="divide-y divide-neutral-200/70 rounded-lg bg-neutral-50 px-4 text-sm">
      <CopyRow label={t("Send Money to")} value={to} copy={toCopy} t={t} />
      <CopyRow
        label={t("Amount")}
        value={amountLabel}
        copy={String(amount)}
        t={t}
      />
    </dl>
  );
}

/** Where the customer sends a bKash/Nagad payment: the venue's number and the amount. */
export function WalletDetails({
  venuePhone,
  amount,
  amountLabel,
  t = plainT,
}: {
  venuePhone: string;
  amount: number;
  amountLabel: string;
  t?: T;
}) {
  const n = walletNumber(venuePhone);
  return (
    <SendMoneyRows
      to={n.shown}
      toCopy={n.copy}
      amount={amount}
      amountLabel={amountLabel}
      t={t}
    />
  );
}
