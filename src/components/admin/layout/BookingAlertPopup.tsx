"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Volume2, VolumeX } from "lucide-react";
import { payLabels, ROUTES } from "@/src/constants";
import { dateLabel, rangeLabel, taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  acknowledgeAll,
  markRead,
  setSound,
  useNotifications,
} from "@/src/lib/notifications";
import { startOrderAlarm, stopOrderAlarm } from "@/src/lib/sound";
import { paidOf, useTurfDB } from "@/src/lib/store";
import { abtn, Modal, ModalActions } from "../ui";

/**
 * Pops up when a new online booking arrives and keeps playing the booking sound until staff respond —
 * "View booking" opens it, "Dismiss" stops the alert (it stays unread in the bell). Synced across tabs.
 */
export function BookingAlertPopup() {
  const t = useT();
  const router = useRouter();
  const db = useTurfDB();
  const { items, sound } = useNotifications();
  const ringing = items.filter((n) => n.ringing);
  const latest = ringing[0];
  const active = !!latest;

  // Ring continuously while anything is unanswered and sound is on.
  useEffect(() => {
    if (!active || !sound) return;
    startOrderAlarm();
    return stopOrderAlarm;
  }, [active, sound]);

  if (!latest) return null;
  const b = db.bookings.find((x) => x.id === latest.bookingId);
  const more = ringing.length - 1;

  const view = () => {
    markRead(latest.id);
    acknowledgeAll();
    router.push(ROUTES.adminBooking(latest.bookingId));
  };

  return (
    <Modal open onClose={acknowledgeAll} title={t("New booking")}>
      <div className="flex flex-col items-center text-center">
        <span className="relative flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60"
          />
          <BellRing className="relative size-8 origin-top animate-[bell-ring_1.2s_ease-in-out_infinite]" />
        </span>
        <p className="mt-4 text-lg font-semibold text-neutral-900">
          {latest.title}
        </p>
        <p className="mt-1 text-sm text-neutral-600">{latest.body}</p>
      </div>

      {b && (
        <dl className="mt-5 divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-sm">
          {[
            [t("Customer"), `${b.customer.name} · ${b.customer.phone}`],
            [
              t("Slot"),
              `${dateLabel(b.date)} · ${rangeLabel(b.startHour, b.duration)}`,
            ],
            [t("Total"), taka(b.total)],
            [
              t("Paid"),
              `${taka(paidOf(b))}${b.payments[0] ? ` · ${t(payLabels[b.payments[0].method])}` : ""}`,
            ],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 px-3 py-2.5">
              <dt className="text-neutral-500">{k}</dt>
              <dd className="text-right font-medium text-neutral-900">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {more > 0 && (
        <p className="mt-3 text-center text-[13px] font-medium text-emerald-800">
          {t("+{n} more new bookings", { n: more })}
        </p>
      )}

      <button
        type="button"
        onClick={() => setSound(!sound)}
        className="mx-auto mt-4 flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-800"
      >
        {sound ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
        {sound ? t("Mute sound") : t("Turn sound on")}
      </button>

      <div className="mt-4">
        <ModalActions>
          <button
            type="button"
            onClick={acknowledgeAll}
            className={abtn.outline}
          >
            {t("Dismiss")}
          </button>
          <button type="button" onClick={view} className={abtn.primary}>
            {t("View booking")}
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
