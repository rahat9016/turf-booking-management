"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ROUTES } from "@/src/constants";
import { rangeLabel, relativeDay } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";
import { useHydrated } from "./useHydrated";

/** Pops a toast when a booking arrives from another tab (i.e. a customer), so staff never miss one. */
export function useNewBookingAlerts() {
  const db = useTurfDB();
  const hydrated = useHydrated();
  const router = useRouter();
  const t = useT();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });
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
      toast.info(
        <button
          type="button"
          onClick={() => router.push(ROUTES.adminBooking(b.id))}
          className="block text-left"
        >
          <span className="block font-semibold">
            {tRef.current("New booking {code}", { code: b.code })}
          </span>
          <span className="block text-xs opacity-80">
            {b.customer.name} · {relativeDay(b.date)}{" "}
            {rangeLabel(b.startHour, b.duration)}
          </span>
        </button>,
        { autoClose: 9000 }
      );
    }
  }, [db.bookings, hydrated, router]);
}
