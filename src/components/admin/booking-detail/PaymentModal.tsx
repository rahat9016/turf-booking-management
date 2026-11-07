"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  MethodTiles,
  SendMoneyRows,
  TrxIdField,
  WalletDetails,
} from "@/src/components/payment";
import { ROUTES, TRX_ID } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  addPayment,
  creditOf,
  dueOf,
  trxUsed,
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

const COLLECT_METHODS: PayMethod[] = ["cash", "bkash", "nagad", "card"];
const REFUND_METHODS: PayMethod[] = ["cash", "bkash", "nagad"];

/** Collect the balance, or (with `refund`) send money back — same layout as the booking site's payment step. */
export function PaymentModal({
  b,
  refund,
  onClose,
}: {
  b: Booking;
  refund?: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const db = useTurfDB();
  const router = useRouter();
  const now = useNow(30_000);
  const due = dueOf(b);
  const credit = creditOf(b, now);
  const limit = refund ? credit : Infinity;
  const [amount, setAmount] = useState(String((refund ? credit : due) || ""));
  const [method, setMethod] = useState<PayMethod>("cash");
  const [ref, setRef] = useState("");
  const [touched, setTouched] = useState(false);
  const n = Number(amount) || 0;
  const wallet = method === "bkash" || method === "nagad";
  // Money coming in by wallet must carry the customer's transaction ID; a refund's ID is optional (it's the venue's own transfer).
  const refError =
    refund || !wallet
      ? undefined
      : !ref
        ? t("Enter the transaction ID from the SMS")
        : !TRX_ID.test(ref)
          ? t("A transaction ID is 8–10 letters and numbers")
          : trxUsed(db, method, ref)
            ? t("This transaction ID has already been used")
            : undefined;
  const close = () => {
    // Drop ?do=… so a refresh doesn't reopen the form; keep ?from for the Back button.
    const q = new URLSearchParams(window.location.search);
    q.delete("do");
    router.replace(`${ROUTES.adminBooking(b.id)}${q.size ? `?${q}` : ""}`, {
      scroll: false,
    });
    onClose();
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (n <= 0) return toast.error(t("Enter an amount"));
    if (n > limit)
      return toast.error(
        t("At most {amount} can be refunded", { amount: taka(limit) })
      );
    if (refError) return;
    addPayment(
      b.id,
      n,
      method,
      refund ? "refund" : "balance",
      wallet ? ref : ""
    );
    toast.success(
      refund
        ? t("{amount} refunded to {name}", {
            amount: taka(n),
            name: b.customer.name,
          })
        : t("{amount} received", { amount: taka(n) })
    );
    close();
  };

  return (
    <Modal
      open
      onClose={close}
      title={refund ? t("Refund") : t("Collect payment")}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Amount (৳)"
          hint={
            refund
              ? t("Owed back {amount}", { amount: taka(credit) })
              : t("Due {amount}", { amount: taka(due) })
          }
        >
          <input
            autoFocus
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            className={cn(
              inputClass,
              "h-12 text-base font-semibold tabular-nums"
            )}
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-800">
            {refund ? t("Refund by") : t("Pay with")}
          </p>
          <MethodTiles
            t={t}
            methods={refund ? REFUND_METHODS : COLLECT_METHODS}
            value={method}
            onChange={(m) => {
              setMethod(m);
              setRef("");
            }}
          />
        </div>

        {wallet &&
          (refund ? (
            <SendMoneyRows
              to={b.customer.phone || "—"}
              toCopy={b.customer.phone}
              amount={n}
              amountLabel={taka(n)}
              t={t}
            />
          ) : (
            <WalletDetails
              t={t}
              venuePhone={db.settings.phone}
              amount={n}
              amountLabel={taka(n)}
            />
          ))}
        {wallet && (
          <TrxIdField
            t={t}
            id="pm-ref"
            method={method}
            value={ref}
            onChange={setRef}
            error={touched ? refError : undefined}
            inputClassName={inputClass}
            labelClassName={labelClass}
          />
        )}

        <ModalActions>
          <button type="button" onClick={close} className={abtn.outline}>
            {t("Cancel")}
          </button>
          <button
            className={
              refund
                ? cn(abtn.primary, "bg-violet-700 hover:bg-violet-800")
                : abtn.primary
            }
          >
            {refund ? t("Refund") : t("Collect")} {n ? taka(n) : ""}
          </button>
        </ModalActions>
      </form>
    </Modal>
  );
}
