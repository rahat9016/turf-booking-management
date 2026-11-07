"use client";

import { useCallback, useSyncExternalStore } from "react";
import { LANG_EVENT, STORAGE_KEYS } from "@/src/constants";
import type { Lang, T, TranslateVars } from "@/src/types";
import { bn } from "./bn";

/**
 * Language for every page — the booking site and its admin share one setting. English by default;
 * strings are looked up by their English text, so anything untranslated shows in English.
 */

const read = (): Lang => {
  try {
    return localStorage.getItem(STORAGE_KEYS.lang) === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
};

const subscribe = (cb: () => void) => {
  window.addEventListener(LANG_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(LANG_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  } catch {}
  document.documentElement.lang = lang;
  window.dispatchEvent(new Event(LANG_EVENT));
}

export const useLang = () =>
  useSyncExternalStore(subscribe, read, () => "en" as Lang);

/** `{name}` placeholders are filled from `vars`, in either language. */
export function translate(lang: Lang, text: string, vars?: TranslateVars) {
  const out = lang === "bn" ? (bn[text] ?? text) : text;
  return vars
    ? out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
    : out;
}

/** `t("Bookings")` → "বুকিং" in Bangla, "Bookings" in English. */
export function useT(): T {
  const lang = useLang();
  return useCallback(
    (text: string, vars?: TranslateVars) => translate(lang, text, vars),
    [lang]
  );
}

/** English with placeholders filled — for shared pieces that don't translate. */
export const plainT: T = (text, vars) => translate("en", text, vars);
