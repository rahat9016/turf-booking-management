"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { ROUTES } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { timeAgo } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import {
  type AdminNotification,
  clearNotifications,
  markAllRead,
  markRead,
  setSound,
  systemNotificationsSupported,
  useNotifications,
} from "@/src/lib/notifications";
import { playChime } from "@/src/lib/sound";
import { cn } from "@/src/lib/utils";
import { abtn } from "../ui";

const noop = () => () => {};
/** Current browser permission for system notifications; re-read after asking. */
function usePermission() {
  const [, bump] = useState(0);
  const value = useSyncExternalStore(
    noop,
    () =>
      systemNotificationsSupported() ? Notification.permission : "unsupported",
    () => "unsupported" as const
  );
  const ask = async () => {
    if (!systemNotificationsSupported()) return;
    await Notification.requestPermission();
    bump((n) => n + 1);
  };
  return [value, ask] as const;
}

/** Header bell: unread count, the latest booking alerts, mute, and opt-in for system notifications. */
export function NotificationBell() {
  const t = useT();
  const router = useRouter();
  const now = useNow(30_000);
  const { items, sound } = useNotifications();
  const [open, setOpen] = useState(false);
  const [permission, askPermission] = usePermission();
  const unread = items.filter((n) => !n.read).length;

  const openItem = (n: AdminNotification) => {
    markRead(n.id);
    setOpen(false);
    router.push(ROUTES.adminBooking(n.bookingId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={
          unread
            ? t("Notifications ({n} unread)", { n: unread })
            : t("Notifications")
        }
        className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
      >
        {unread ? (
          <BellRing className="size-5 origin-top animate-[bell-ring_1.2s_ease-in-out_2]" />
        ) : (
          <Bell className="size-5" />
        )}
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold tabular-nums text-white ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>

      {/* Phones: nearly full width under the header; wider screens: a 384px panel. */}
      <PopoverContent
        align="end"
        sideOffset={10}
        collisionPadding={12}
        className="w-[calc(100vw-1.5rem)] max-w-96 overflow-hidden rounded-xl bg-white p-0 sm:w-96"
      >
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3">
          <p className="font-semibold text-neutral-900">{t("Notifications")}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSound(!sound);
                if (!sound) playChime();
              }}
              aria-pressed={sound}
              aria-label={sound ? t("Mute sound") : t("Turn sound on")}
              title={sound ? t("Mute sound") : t("Turn sound on")}
              className={abtn.icon}
            >
              {sound ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={markAllRead}
              disabled={!unread}
              aria-label={t("Mark all as read")}
              title={t("Mark all as read")}
              className={abtn.icon}
            >
              <CheckCheck className="size-4" />
            </button>
            <button
              type="button"
              onClick={clearNotifications}
              disabled={!items.length}
              aria-label={t("Clear all")}
              title={t("Clear all")}
              className={abtn.icon}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {permission === "default" && (
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-900">
            <span>
              {t("Get alerts even when this tab is in the background.")}
            </span>
            <button
              type="button"
              onClick={askPermission}
              className={cn(abtn.small, "shrink-0")}
            >
              {t("Turn on")}
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <Bell className="size-7 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-800">
              {t("No notifications yet")}
            </p>
            <p className="text-[13px] text-neutral-500">
              {t("New online bookings will show up here.")}
            </p>
          </div>
        ) : (
          <ul className="max-h-[60dvh] divide-y divide-neutral-100 overflow-y-auto">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => openItem(n)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-neutral-50",
                    !n.read && "bg-emerald-50/50"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-emerald-600"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm text-neutral-900",
                        !n.read && "font-semibold"
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-neutral-600">
                      {n.body}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                    {t(timeAgo(n.at, now))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
