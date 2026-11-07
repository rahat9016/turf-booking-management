"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useNow } from "@/src/hooks";
import { dateLabel, rangeLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { findConflict, rescheduleBooking, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { SlotPicker } from "../slot-picker/SlotPicker";
import { abtn, Modal, ModalActions } from "../ui";

const slotText = (d: string, h: number, n: number) =>
  `${dateLabel(d, { weekday: "short", day: "numeric", month: "short" })} · ${rangeLabel(h, n)}`;

export function RescheduleModal({
  b,
  onClose,
}: {
  b: Booking;
  onClose: () => void;
}) {
  const t = useT();
  const db = useTurfDB();
  const now = useNow(15_000);
  const [date, setDate] = useState(b.date);
  const [start, setStart] = useState<number | null>(b.startHour);
  const [duration, setDuration] = useState(b.duration);
  const req =
    start !== null
      ? { courtId: b.courtId, date, startHour: start, duration }
      : null;
  const conflict = req
    ? findConflict(db, req, { ignoreBookingId: b.id, now })
    : null;
  const unchanged =
    date === b.date && start === b.startHour && duration === b.duration;

  const move = () => {
    if (!req) return;
    const r = rescheduleBooking(b.id, req);
    if (!r.ok) return toast.error(t(r.error));
    toast.success(t("{code} moved", { code: b.code }));
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={t("Reschedule booking")}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-[13px] sm:text-sm">
          <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
            <p className="text-xs text-neutral-500">{t("Now")}</p>
            <p className="font-medium text-neutral-900">
              {slotText(b.date, b.startHour, b.duration)}
            </p>
          </div>
          <div
            className={cn(
              "rounded-md border px-3 py-2",
              !unchanged && req && !conflict
                ? "border-emerald-300 bg-emerald-50"
                : "border-neutral-200"
            )}
          >
            <p className="text-xs text-neutral-500">{t("New")}</p>
            <p className="font-medium text-neutral-900">
              {start !== null
                ? slotText(date, start, duration)
                : t("Pick a time")}
            </p>
          </div>
        </div>

        <SlotPicker
          date={date}
          start={start}
          duration={duration}
          onDate={(d) => {
            setDate(d);
            setStart(d === b.date ? b.startHour : null);
          }}
          onStart={setStart}
          onDuration={setDuration}
          conflict={conflict}
          bookingId={b.id}
        />

        <ModalActions>
          <button onClick={onClose} className={abtn.outline}>
            {t("Cancel")}
          </button>
          <button
            disabled={!req || unchanged || !!conflict}
            onClick={move}
            className={abtn.primary}
          >
            {t("Move booking")}
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
