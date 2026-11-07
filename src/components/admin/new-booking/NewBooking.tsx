"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { FieldError } from "@/src/components/common";
import {
  AmountChoice,
  MethodTiles,
  TrxIdField,
  WalletDetails,
} from "@/src/components/payment";
import { BD_PHONE, ROUTES, TRX_ID } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { taka, todayYmd } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  createAdminBooking,
  findConflict,
  groundOf,
  quote,
  trxUsed,
  useTurfDB,
} from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { PayMethod } from "@/src/types";
import { SlotPicker } from "../slot-picker/SlotPicker";
import { abtn, Field, inputClass, labelClass } from "../ui";
import { BookingSummary } from "./BookingSummary";
import { Section } from "./Section";

const DESK_METHODS: PayMethod[] = ["cash", "bkash", "nagad", "card"];

/** Front-desk booking: pick the slot, take the customer's name and number, record the booking money. */
export function NewBooking() {
  const t = useT();
  const db = useTurfDB();
  const router = useRouter();
  const now = useNow(30_000);
  const ground = groundOf(db);
  const [date, setDate] = useState(todayYmd());
  const [start, setStart] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [full, setFull] = useState(false);
  const [method, setMethod] = useState<PayMethod>("cash");
  const [ref, setRef] = useState("");
  const [refLeft, setRefLeft] = useState(false);
  const [touched, setTouched] = useState(false);

  if (!ground)
    return (
      <p className="text-sm text-neutral-500">
        {t("No ground is open for booking.")}
      </p>
    );

  const { advancePercent, phone: venuePhone } = db.settings;
  const price =
    start !== null ? quote(ground, start, duration, db.settings) : null;
  const amount = price ? (full ? price.total : price.advance) : 0;
  const req =
    start !== null
      ? { courtId: ground.id, date, startHour: start, duration }
      : null;
  // Staff may record a game that is already under way, so past start times are allowed.
  const conflict = req ? findConflict(db, req, { now, allowPast: true }) : null;
  const wallet = method === "bkash" || method === "nagad";

  const errors: Record<string, string> = {};
  if (!BD_PHONE.test(phone))
    errors.phone = t("Enter a valid 11-digit mobile number");
  if (name.trim().length < 2) errors.name = t("Enter the customer's name");
  if (wallet) {
    if (!ref) errors.ref = t("Enter the transaction ID from the SMS");
    else if (!TRX_ID.test(ref))
      errors.ref = t("A transaction ID is 8–10 letters and numbers");
    else if (trxUsed(db, method, ref))
      errors.ref = t("This transaction ID has already been used");
  }
  const show = (k: string) => (touched ? errors[k] : undefined);

  const save = () => {
    setTouched(true);
    if (!req || !price) return toast.error(t("Pick a kick-off time"));
    if (Object.keys(errors).length) return;
    const r = createAdminBooking({
      ...req,
      customer: { name: name.trim(), phone },
      source: "walk-in",
      total: price.total,
      paid: amount,
      method,
      ref: wallet ? ref : undefined,
    });
    if (!r.ok) return toast.error(t(r.error));
    toast.success(t("Booking {code} created", { code: r.value.code }));
    router.push(ROUTES.adminBooking(r.value.id));
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 sm:mb-4 sm:px-5">
        <Link
          href={ROUTES.adminBookings}
          aria-label={t("Back to bookings")}
          className={cn(abtn.outline, "size-10 shrink-0 px-0")}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          {t("New booking")}
        </h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <Section n={1} title="Date & time">
            <SlotPicker
              date={date}
              start={start}
              duration={duration}
              onDate={(d) => {
                setDate(d);
                setStart(null);
              }}
              onStart={setStart}
              onDuration={setDuration}
              conflict={conflict}
              allowNowHour
              numbered={false}
              className="sm:grid-cols-5 xl:grid-cols-6"
            />
          </Section>

          <Section n={2} title="Customer">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Mobile number">
                <input
                  value={phone}
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="01712 345678"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  className={inputClass}
                  aria-invalid={!!show("phone")}
                />
                <FieldError message={show("phone")} />
              </Field>
              <Field label="Full name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("e.g. Tamim Rahman")}
                  className={inputClass}
                  aria-invalid={!!show("name")}
                />
                <FieldError message={show("name")} />
              </Field>
            </div>
          </Section>

          <Section n={3} title="Payment">
            <AmountChoice
              options={[
                {
                  v: false,
                  t: t("{n}% advance", { n: advancePercent }),
                  a: price ? taka(price.advance) : "—",
                },
                {
                  v: true,
                  t: t("Full amount"),
                  a: price ? taka(price.total) : "—",
                },
              ]}
              value={full}
              onChange={setFull}
            />

            <p className="mb-2 mt-5 text-sm font-medium text-neutral-800">
              {t("Pay with")}
            </p>
            <MethodTiles
              t={t}
              methods={DESK_METHODS}
              value={method}
              onChange={(m) => {
                setMethod(m);
                setRef("");
                setRefLeft(false);
              }}
            />

            {wallet && (
              <>
                <div className="mt-4">
                  <WalletDetails
                    t={t}
                    venuePhone={venuePhone}
                    amount={amount}
                    amountLabel={price ? taka(amount) : "—"}
                  />
                </div>
                <div className="mt-4">
                  <TrxIdField
                    t={t}
                    id="nb-ref"
                    method={method}
                    value={ref}
                    onChange={setRef}
                    onCommit={(v) => setRefLeft(!!v)}
                    error={
                      (touched || refLeft) && errors.ref
                        ? errors.ref
                        : undefined
                    }
                    inputClassName={inputClass}
                    labelClassName={labelClass}
                  />
                </div>
              </>
            )}
          </Section>
        </div>

        <BookingSummary
          date={date}
          start={start}
          duration={duration}
          price={price}
          amount={amount}
          disabled={start === null || !!conflict}
          onSave={save}
        />
      </div>
    </div>
  );
}
