"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  AmountChoice,
  MethodTiles,
  SendMoneyRows,
  TrxIdField,
} from "@/src/components/payment";
import { useNow } from "@/src/hooks";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  addPayment,
  cancelBooking,
  freeToCancel,
  paidOf,
  useTurfDB,
} from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking, PayMethod } from "@/src/types";
import {
  abtn,
  Field,
  inputClass,
  labelClass,
  Modal,
  ModalActions,
} from "../ui";
import type { MoneyChoice } from "./types";

const REFUND_METHODS: PayMethod[] = ["cash", "bkash", "nagad"];

/** Cancel with a reason, and decide on the money already paid: refund it now, owe it, or keep it. */
export function CancelModal({
  b,
  onClose,
}: {
  b: Booking;
  onClose: () => void;
}) {
  const t = useT();
  const db = useTurfDB();
  const now = useNow(60_000);
  const paid = paidOf(b);
  const hours = db.settings.cancelCutoffHours;
  const free = freeToCancel(b, db.settings, now);
  const [reason, setReason] = useState("");
  // Inside the free-cancellation window (Settings) the customer gets the money back; later than that the venue keeps it by default.
  const [money, setMoney] = useState<MoneyChoice>(free ? "now" : "keep");
  const [method, setMethod] = useState<PayMethod>("cash");
  const [ref, setRef] = useState("");
  const wallet = method === "bkash" || method === "nagad";
  const refundNow = paid > 0 && money === "now";

  const confirmCancel = () => {
    cancelBooking(
      b.id,
      reason.trim() || undefined,
      paid > 0 && money === "keep"
    );
    if (refundNow) addPayment(b.id, paid, method, "refund", wallet ? ref : "");
    toast.success(
      refundNow
        ? t("{code} cancelled · {amount} refunded", {
            code: b.code,
            amount: taka(paid),
          })
        : t("{code} cancelled", { code: b.code })
    );
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={t("Cancel {code}", { code: b.code })}>
      <div className="space-y-4">
        <Field label="Reason" hint="Shown to the customer under My Bookings">
          <input
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
            placeholder={t("e.g. Rain, ground closed")}
          />
        </Field>

        {paid > 0 && (
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-neutral-800">
                {taka(paid)} paid
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  free ? "text-emerald-700" : "text-rose-700"
                )}
              >
                {free
                  ? t("Free cancellation (over {n} hrs before)", { n: hours })
                  : t("Late cancellation (under {n} hrs before)", { n: hours })}
              </p>
            </div>
            <AmountChoice<MoneyChoice>
              className="sm:grid-cols-1"
              options={[
                { v: "now", t: t("Refund now"), a: taka(paid) },
                {
                  v: "later",
                  t: t("Refund later (before kick-off)"),
                  a: taka(paid),
                },
                { v: "keep", t: t("Keep the money"), a: t("No refund") },
              ]}
              value={money}
              onChange={setMoney}
            />
          </div>
        )}

        {refundNow && (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-800">
                {t("Refund by")}
              </p>
              <MethodTiles
                t={t}
                methods={REFUND_METHODS}
                value={method}
                onChange={(m) => {
                  setMethod(m);
                  setRef("");
                }}
              />
            </div>
            {wallet && (
              <>
                <SendMoneyRows
                  to={b.customer.phone || "—"}
                  toCopy={b.customer.phone}
                  amount={paid}
                  amountLabel={taka(paid)}
                  t={t}
                />
                <TrxIdField
                  t={t}
                  id="cm-ref"
                  method={method}
                  value={ref}
                  onChange={setRef}
                  inputClassName={inputClass}
                  labelClassName={labelClass}
                />
              </>
            )}
          </>
        )}

        <ModalActions>
          <button onClick={onClose} className={abtn.outline}>
            {t("Keep booking")}
          </button>
          <button
            onClick={confirmCancel}
            className={cn(abtn.primary, "bg-rose-600 hover:bg-rose-700")}
          >
            {refundNow
              ? t("Cancel & refund {amount}", { amount: taka(paid) })
              : t("Cancel booking")}
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
