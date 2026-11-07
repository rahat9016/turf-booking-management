"use client";

import { payLabels, paymentKindLabels } from "@/src/constants";
import type { PaymentKind, PayMethod } from "@/src/types";
import { ToolbarSelect } from "../ui";
import type { KindFilter, Period } from "./utils";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "all", label: "All time" },
];
const METHODS = [
  { value: "all" as const, label: "All methods" },
  ...Object.entries(payLabels).map(([value, label]) => ({
    value: value as PayMethod,
    label,
  })),
];
const KINDS = [
  { value: "all" as const, label: "All types" },
  ...(Object.keys(paymentKindLabels) as PaymentKind[]).map((k) => ({
    value: k,
    label: paymentKindLabels[k],
  })),
];

/** Period, method and type filters for the transactions tab; non-default ones are highlighted. */
export function TransactionFilters({
  period,
  onPeriod,
  method,
  onMethod,
  kind,
  onKind,
}: {
  period: Period;
  onPeriod: (p: Period) => void;
  method: "all" | PayMethod;
  onMethod: (m: "all" | PayMethod) => void;
  kind: KindFilter;
  onKind: (k: KindFilter) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:ml-auto lg:flex">
      <div className="max-sm:col-span-2">
        <ToolbarSelect
          label="Period"
          value={period}
          active={period !== "30"}
          onChange={onPeriod}
          options={PERIODS}
        />
      </div>
      <ToolbarSelect
        label="Method"
        value={method}
        active={method !== "all"}
        onChange={onMethod}
        options={METHODS}
      />
      <ToolbarSelect
        label="Type"
        value={kind}
        active={kind !== "all"}
        onChange={onKind}
        options={KINDS}
      />
    </div>
  );
}
