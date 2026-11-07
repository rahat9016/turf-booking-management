"use client";

import { useEffect } from "react";
import { setLang, useLang } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { Lang } from "@/src/types";

const LANGS: [Lang, string][] = [
  ["en", "EN"],
  ["bn", "বাংলা"],
];

/**
 * EN / বাংলা switch — the booking site and the admin share the choice, remembered in this browser.
 * `dark` is the glass style for the site's dark header.
 */
export function LanguageSwitch({
  dark,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <div
      role="radiogroup"
      aria-label="Language / ভাষা"
      className={cn(
        "flex h-9 shrink-0 items-center rounded-full p-0.5 text-xs font-semibold sm:h-10 sm:p-1 sm:text-[13px]",
        dark
          ? "bg-white/10 ring-1 ring-white/20"
          : "border border-neutral-200 bg-white",
        className
      )}
    >
      {LANGS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={lang === value}
          onClick={() => setLang(value)}
          className={cn(
            "h-7.5 rounded-full px-2.5 transition sm:h-8 sm:px-3",
            lang === value
              ? dark
                ? "bg-lime-400 text-emerald-950"
                : "bg-emerald-700 text-white"
              : dark
                ? "text-white/80 hover:text-white"
                : "text-neutral-600 hover:text-emerald-700"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
