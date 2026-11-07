"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/src/constants";
import type { TurfDB } from "@/src/types";
import { createSeed, DB_VERSION, staticState } from "./seed";

/**
 * Demo backend for TurfHub: one JSON document in localStorage shared by the booking site and the
 * admin panel. Every write re-reads the latest copy first and other tabs pick changes up through
 * the `storage` event — so a slot held or booked in one tab disappears from every other tab live.
 */
const KEY = STORAGE_KEYS.db;

let state: TurfDB | null = null;
const listeners = new Set<() => void>();

function read(): TurfDB | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TurfDB;
    return parsed.version === DB_VERSION && parsed.seeded ? parsed : null;
  } catch {
    return null;
  }
}

function persist(next: TurfDB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked — keep working in memory.
  }
}

function load(): TurfDB {
  const existing = read();
  if (existing) return existing;
  const fresh = createSeed();
  persist(fresh);
  return fresh;
}

function getState(): TurfDB {
  if (typeof window === "undefined") return staticState;
  if (!state) state = load();
  return state;
}

function emit() {
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return;
  state = read() ?? load();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Applies `fn` to the latest stored copy (with expired holds dropped), saves it and notifies subscribers. */
export function update(fn: (s: TurfDB) => TurfDB) {
  // Start from what is on disk, not our cached copy: another tab may have written a moment ago
  // and its storage event has not reached us yet.
  const base = read() ?? getState();
  const now = Date.now();
  state = fn({ ...base, holds: base.holds.filter((h) => h.expiresAt > now) });
  persist(state);
  emit();
}

export function useTurfDB(): TurfDB {
  return useSyncExternalStore(subscribe, getState, () => staticState);
}

export function resetDemoData() {
  state = createSeed();
  persist(state);
  emit();
}

export const uid = (p: string) =>
  `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const nowIso = () => new Date().toISOString();

/** Stable per-tab id, so a customer's own hold is shown as "your selection" and not as taken. */
export function getClientId() {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(STORAGE_KEYS.clientId);
    if (!id) {
      id = uid("cl");
      sessionStorage.setItem(STORAGE_KEYS.clientId, id);
    }
    return id;
  } catch {
    return "anon";
  }
}
