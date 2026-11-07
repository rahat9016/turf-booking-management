"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/src/constants";

/**
 * Front-desk notification inbox, kept in this browser's localStorage and shared live across its tabs.
 * Each entry points at the booking that triggered it.
 */
export type AdminNotification = {
  id: string;
  bookingId: string;
  title: string;
  body: string;
  /** ISO time it arrived. */
  at: string;
  read: boolean;
  /** Still alerting: the popup stays up and the sound repeats until staff acknowledge it. */
  ringing?: boolean;
};

type State = { items: AdminNotification[]; sound: boolean };

const MAX = 50;
const EMPTY: State = { items: [], sound: true };
const listeners = new Set<() => void>();
let cache: State | null = null;

function read(): State {
  try {
    const items = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.adminNotifications) ?? "[]"
    ) as AdminNotification[];
    return {
      items: Array.isArray(items) ? items : [],
      sound: localStorage.getItem(STORAGE_KEYS.adminSound) !== "0",
    };
  } catch {
    return EMPTY;
  }
}

function getState() {
  if (typeof window === "undefined") return EMPTY;
  cache ??= read();
  return cache;
}

function write(next: State) {
  cache = next;
  try {
    localStorage.setItem(
      STORAGE_KEYS.adminNotifications,
      JSON.stringify(next.items)
    );
    localStorage.setItem(STORAGE_KEYS.adminSound, next.sound ? "1" : "0");
  } catch {}
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (
    e.key !== STORAGE_KEYS.adminNotifications &&
    e.key !== STORAGE_KEYS.adminSound
  )
    return;
  cache = read();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(l);
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const useNotifications = () =>
  useSyncExternalStore(subscribe, getState, () => EMPTY);

/** Adds a notification; returns its id, or null when this booking was already logged. */
export function pushNotification(
  n: Omit<AdminNotification, "id" | "at" | "read" | "ringing">
) {
  const s = getState();
  // One entry per booking, even if two admin tabs both see it arrive.
  if (s.items.some((x) => x.bookingId === n.bookingId)) return null;
  const item: AdminNotification = {
    ...n,
    id: `nt${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    at: new Date().toISOString(),
    read: false,
    ringing: true,
  };
  write({ ...s, items: [item, ...s.items].slice(0, MAX) });
  return item.id;
}

export const markRead = (id: string) =>
  write({
    ...getState(),
    items: getState().items.map((x) =>
      x.id === id ? { ...x, read: true, ringing: false } : x
    ),
  });
export const markAllRead = () =>
  write({
    ...getState(),
    items: getState().items.map((x) => ({ ...x, read: true, ringing: false })),
  });
/** Stops the alert (popup + repeating sound) for every ringing notification; they stay unread in the bell. */
export const acknowledgeAll = () =>
  write({
    ...getState(),
    items: getState().items.map((x) => ({ ...x, ringing: false })),
  });
export const clearNotifications = () => write({ ...getState(), items: [] });
export const setSound = (on: boolean) => write({ ...getState(), sound: on });

/* System (OS) notifications — shown on desktop and on phones that allow them for this site. */

export const systemNotificationsSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

/** Registers /sw.js so phones can show system notifications (they don't allow `new Notification`). */
export function registerNotificationWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
    return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

/**
 * OS notification for a booking. Goes through the service worker when there is one (required on Android),
 * otherwise the plain Notification API (desktop). Tapping it opens `url`.
 */
export async function showSystemNotification(
  title: string,
  body: string,
  url: string,
  onClick: () => void
) {
  if (!systemNotificationsSupported() || Notification.permission !== "granted")
    return;
  const options = { body, icon: "/favicon.ico", tag: url, data: { url } };
  try {
    const reg =
      "serviceWorker" in navigator
        ? await navigator.serviceWorker.getRegistration()
        : undefined;
    if (reg) return void (await reg.showNotification(title, options));
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      onClick();
      n.close();
    };
  } catch {
    // Blocked or unsupported here (e.g. iOS outside a home-screen app) — the in-app bell still works.
  }
}
