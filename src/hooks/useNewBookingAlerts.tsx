"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants";
import { rangeLabel, relativeDay } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  markRead,
  pushNotification,
  registerNotificationWorker,
  showSystemNotification,
} from "@/src/lib/notifications";
import { unlockAudio } from "@/src/lib/sound";
import { useTurfDB } from "@/src/lib/store";
import { useHydrated } from "./useHydrated";

/**
 * Watches for bookings arriving from another tab (i.e. a customer) and alerts the desk: adds it to the
 * header bell (which also raises the ringing popup) and — if allowed — shows a system notification on desktop or phone.
 */
export function useNewBookingAlerts() {
  const db = useTurfDB();
  const hydrated = useHydrated();
  const router = useRouter();
  const t = useT();
  // Latest values for the effect without re-running it on every language or mute change.
  const latest = useRef({ t });
  useEffect(() => {
    latest.current = { t };
  });
  useEffect(() => {
    unlockAudio();
    registerNotificationWorker();
  }, []);

  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (!seen.current) {
      seen.current = new Set(db.bookings.map((b) => b.id));
      return;
    }
    for (const b of db.bookings) {
      if (seen.current.has(b.id)) continue;
      seen.current.add(b.id);
      if (b.source !== "online") continue;

      const { t: tr } = latest.current;
      const title = tr("New booking {code}", { code: b.code });
      const body = `${b.customer.name} · ${tr(relativeDay(b.date))} ${rangeLabel(b.startHour, b.duration)}`;
      // Another admin tab may already have logged it; only the first one alerts.
      const id = pushNotification({ bookingId: b.id, title, body });
      if (!id) continue;

      // The popup and repeating sound come from <BookingAlertPopup>, driven by the `ringing` flag.
      const open = () => {
        markRead(id);
        router.push(ROUTES.adminBooking(b.id));
      };
      void showSystemNotification(title, body, ROUTES.adminBooking(b.id), open);
    }
  }, [db.bookings, hydrated, router]);
}
