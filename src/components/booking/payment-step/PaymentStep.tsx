"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { inputClass, labelClass } from "@/src/components/common";
import {
  AmountChoice,
  MethodTiles,
  TrxIdField,
  WalletDetails,
} from "@/src/components/payment";
import { BD_PHONE, TRX_ID } from "@/src/constants";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { getSavedPhone } from "@/src/lib/storage";
import { createOnlineBooking, trxUsed, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Court, OnlinePayMethod, Quote, SlotRequest } from "@/src/types";
import { MatchTicket } from "../MatchTicket";
import { StepTitle } from "../Step";
import { CardFields, type CardForm } from "./CardFields";
import { CustomerFields, type CustomerForm } from "./CustomerFields";
import { HoldCountdown } from "./HoldCountdown";
import { PaymentSummary } from "./PaymentSummary";

const ONLINE_METHODS: OnlinePayMethod[] = ["bkash", "nagad", "card"];

export function PaymentStep({
  court,
  selection,
  price,
  expiresAt,
  now,
  clientId,
  onBack,
  onDone,
}: {
  court: Court;
  selection: SlotRequest;
  price: Quote;
  expiresAt: number;
  now: number;
  clientId: string;
  onBack: () => void;
  onDone: (code: string, phone: string) => void;
}) {
  const tr = useT();
  const db = useTurfDB();
  const { advancePercent, holdMinutes, phone: venuePhone } = db.settings;
  const [form, setForm] = useState<CustomerForm>(() => ({
    name: "",
    phone: getSavedPhone(),
  }));
  const [method, setMethod] = useState<OnlinePayMethod>("bkash");
  const [full, setFull] = useState(false);
  const [ref, setRef] = useState("");
  const [refLeft, setRefLeft] = useState(false);
  const [card, setCard] = useState<CardForm>({ number: "", exp: "", cvc: "" });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const amount = full ? price.total : price.advance;
  const cardDigits = card.number.replace(/\D/g, "");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = tr("Enter your name");
    if (!BD_PHONE.test(form.phone.trim()))
      e.phone = tr("Enter a valid 11-digit mobile number");
    if (method === "card") {
      if (cardDigits.length !== 16)
        e.card = tr("Card number must be 16 digits");
      else if (!/^\d{2}\/\d{2}$/.test(card.exp)) e.card = tr("Expiry as MM/YY");
      else if (!/^\d{3,4}$/.test(card.cvc)) e.card = tr("Enter the CVC");
    } else if (!ref) e.ref = tr("Enter the transaction ID from the SMS");
    else if (!TRX_ID.test(ref))
      e.ref = tr("A transaction ID is 8–10 letters and numbers");
    else if (trxUsed(db, method, ref))
      e.ref = tr("This transaction ID has already been used");
    return e;
  }, [db, form, method, ref, card, cardDigits, tr]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    setBusy(true);
    const r = createOnlineBooking(
      {
        ...selection,
        customer: { name: form.name.trim(), phone: form.phone.trim() },
        method,
        amount,
        ref: method === "card" ? `CARD •••• ${cardDigits.slice(-4)}` : ref,
      },
      clientId
    );
    setBusy(false);
    if (!r.ok) {
      toast.error(tr(r.error));
      return;
    }
    toast.success(tr("Booking {code} received!", { code: r.value.code }));
    onDone(r.value.code, r.value.customer.phone);
  };

  const shown = (k: string) => touched && errors[k];
  // 16px text on phones so iOS doesn't zoom into the field.
  const input = cn(inputClass, "h-12 rounded-lg text-base sm:text-sm");

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 lg:grid-cols-[1fr_440px] lg:items-start"
      noValidate
    >
      <button
        type="button"
        onClick={onBack}
        className="-mb-2 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-emerald-800 lg:col-span-2"
      >
        <ArrowLeft className="size-4" /> {tr("Change slot")}
      </button>
      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/[0.04]">
        <HoldCountdown left={expiresAt - now} holdMinutes={holdMinutes} />

        <div className="p-4 sm:p-5 md:p-6">
          <StepTitle n={1} numbered>
            {tr("Your details")}
          </StepTitle>
          <CustomerFields
            value={form}
            onChange={setForm}
            errors={{ name: shown("name"), phone: shown("phone") }}
            inputClassName={input}
          />

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <StepTitle n={2} numbered>
              {tr("Payment")}
            </StepTitle>
            <div className="mt-3">
              <AmountChoice
                options={[
                  {
                    v: false,
                    t: tr("{n}% advance", { n: advancePercent }),
                    a: taka(price.advance),
                  },
                  { v: true, t: tr("Full amount"), a: taka(price.total) },
                ]}
                value={full}
                onChange={setFull}
              />
            </div>

            <p className="mb-2 mt-5 text-sm font-medium text-neutral-800">
              {tr("Pay with")}
            </p>
            <MethodTiles
              methods={ONLINE_METHODS}
              value={method}
              onChange={setMethod}
              t={tr}
            />

            {method === "card" ? (
              <CardFields
                value={card}
                onChange={setCard}
                error={shown("card")}
                inputClassName={input}
              />
            ) : (
              <>
                <div className="mt-4">
                  <WalletDetails
                    venuePhone={venuePhone}
                    amount={amount}
                    amountLabel={taka(amount)}
                    t={tr}
                  />
                </div>
                <div className="mt-4">
                  <TrxIdField
                    t={tr}
                    id="pf-ref"
                    method={method}
                    value={ref}
                    onChange={setRef}
                    onCommit={(v) => setRefLeft(!!v)}
                    error={
                      (touched || refLeft) && errors.ref
                        ? errors.ref
                        : undefined
                    }
                    inputClassName={input}
                    labelClassName={labelClass}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MatchTicket
        day={selection.date}
        start={selection.startHour}
        duration={selection.duration}
      >
        <PaymentSummary
          courtName={court.name}
          total={price.total}
          amount={amount}
          busy={busy}
        />
      </MatchTicket>
    </form>
  );
}
