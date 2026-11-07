"use client";

import { type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { LanguageSwitch, Loader } from "@/src/components/common";
import { STORAGE_KEYS } from "@/src/constants";
import { useHydrated, useNewBookingAlerts, useNow } from "@/src/hooks";
import { todayYmd } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { creditOf, endMs, resetDemoData, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminUserMenu } from "./AdminUserMenu";
import { BookingAlertPopup } from "./BookingAlertPopup";
import { NotificationBell } from "./NotificationBell";

const topBtn =
  "size-10 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700";

/** Desktop only: an 80px icon rail instead of the full menu, remembered in this browser. */
function useCompactSidebar() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    try {
      // Read after mount so the server HTML and first client render agree.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompact(
        localStorage.getItem(STORAGE_KEYS.adminSidebarCompact) === "1"
      );
    } catch {}
  }, []);
  const toggle = () =>
    setCompact((c) => {
      try {
        localStorage.setItem(STORAGE_KEYS.adminSidebarCompact, c ? "0" : "1");
      } catch {}
      return !c;
    });
  return [compact, toggle] as const;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const t = useT();
  const db = useTurfDB();
  const hydrated = useHydrated();
  const now = useNow(60_000);
  const [open, setOpen] = useState(false);
  const [compact, toggleCompact] = useCompactSidebar();
  useNewBookingAlerts();

  const badges = {
    // Games still to play today, so the desk sees at a glance how busy the day is.
    today: hydrated
      ? db.bookings.filter(
          (b) =>
            b.status === "confirmed" && b.date === todayYmd() && endMs(b) > now
        ).length
      : 0,
    // Refunds still owed — they have to go out before kick-off.
    refunds: hydrated
      ? db.bookings.filter((b) => creditOf(b, now) > 0).length
      : 0,
  };

  const reset = () => {
    if (
      confirm(
        t(
          "Reset all demo data (bookings, payments, content, gallery, settings) to the original sample?"
        )
      )
    ) {
      resetDemoData();
      toast.success(t("Demo data reset"));
    }
  };
  const close = () => setOpen(false);

  return (
    <div className="min-h-screen bg-neutral-50 print:bg-white">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden bg-gradient-to-b from-emerald-950 to-neutral-950 transition-[width] duration-200 lg:block print:hidden",
          compact ? "w-20" : "w-72"
        )}
      >
        <AdminSidebar
          rail={compact}
          badges={badges}
          onNavigate={close}
          onReset={reset}
        />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden">
          <button
            aria-label={t("Close menu")}
            className="absolute inset-0 bg-black/50"
            onClick={close}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-emerald-950 to-neutral-950">
            <button
              onClick={close}
              aria-label={t("Close menu")}
              className="absolute right-3 top-5 text-white"
            >
              <X className="size-5" />
            </button>
            <AdminSidebar
              rail={false}
              badges={badges}
              onNavigate={close}
              onReset={reset}
            />
          </aside>
        </div>
      )}
      <div
        className={cn(
          "min-w-0 transition-[padding] duration-200 print:pl-0",
          compact ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6 xl:px-8 print:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label={t("Open menu")}
            className={cn(topBtn, "flex lg:hidden")}
          >
            <Menu className="size-5" />
          </button>
          <button
            onClick={toggleCompact}
            aria-label={compact ? t("Expand sidebar") : t("Collapse sidebar")}
            title={compact ? t("Expand sidebar") : t("Collapse sidebar")}
            className={cn(topBtn, "hidden hover:text-emerald-700 lg:flex")}
          >
            {compact ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <LanguageSwitch />
            <AdminUserMenu venueName={db.settings.venueName} onReset={reset} />
          </div>
        </header>
        <div className="p-4 print:p-0">{hydrated ? children : <Loader />}</div>
      </div>
      {hydrated && <BookingAlertPopup />}
    </div>
  );
}
