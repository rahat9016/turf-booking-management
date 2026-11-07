"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { tbtn, TurfLogo } from "@/src/components/common";
import { FOOTER_LINKS, ROUTES } from "@/src/constants";
import { useHydrated, useNow } from "@/src/hooks";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { directionsUrl, telHref } from "@/src/lib/payment";
import { useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const columnTitle =
  "text-xs font-medium uppercase tracking-[0.14em] text-emerald-100/40";

export function SiteFooter() {
  const { settings } = useTurfDB();
  const t = useT();
  const tel = telHref(settings.phone);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#021a12] text-emerald-100/70">
      <div className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="sm:col-span-3 lg:col-span-1">
            <TurfLogo className="text-3xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {t(
                "One football turf in Bashundhara. Check what's free, pay a small advance, and play."
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={ROUTES.book} className={tbtn.lime}>
                {t("Book a slot")} <ArrowRight className="size-4" />
              </Link>
              <a
                href={tel}
                className="inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/10"
              >
                <Phone className="size-4" /> {t("Call us")}
              </a>
            </div>
          </div>

          <nav aria-label={t("Footer")}>
            <p className={columnTitle}>{t("Explore")}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/85 transition hover:text-lime-300"
                  >
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={columnTitle}>{t("Visit")}</p>
            <address className="mt-5 text-sm not-italic leading-relaxed text-white/85">
              {settings.address}
            </address>
            <a
              href={directionsUrl(settings.address)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lime-300 hover:underline"
            >
              {t("Get directions")} <ArrowUpRight className="size-4" />
            </a>
            <a
              href={tel}
              className="mt-4 block text-sm text-white/85 transition hover:text-lime-300"
            >
              {settings.phone}
            </a>
          </div>

          <OpeningHours />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-emerald-100/50">
          <p>
            © {new Date().getFullYear()} TurfHub ·{" "}
            {t("Demo — data is stored in your browser.")}
          </p>
          <Link href={ROUTES.admin} className="transition hover:text-lime-300">
            {t("Admin panel")}
          </Link>
        </div>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge. */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[3vw] select-none text-center text-[17vw] font-extrabold leading-[0.8] tracking-tighter text-white/[0.025]"
      >
        TurfHub
      </p>
    </footer>
  );
}

/** Hours column with a live open / closed dot. */
function OpeningHours() {
  const { settings } = useTurfDB();
  const t = useT();
  const hydrated = useHydrated();
  const now = useNow(60_000);
  const hour = new Date(now).getHours();
  const open =
    hydrated && hour >= settings.openHour && hour < settings.closeHour;
  return (
    <div>
      <p className={columnTitle}>{t("Hours")}</p>
      <p className="mt-5 text-sm text-white/85">
        {t("Every day, {from} – {to}", {
          from: hourLabel(settings.openHour),
          to: hourLabel(settings.closeHour),
        })}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm">
        <span
          className={cn(
            "size-2 rounded-full",
            !hydrated ? "bg-white/30" : open ? "bg-lime-400" : "bg-red-400"
          )}
        />
        {!hydrated
          ? " "
          : open
            ? t("Open now · closes {time}", {
                time: hourLabel(settings.closeHour),
              })
            : t("Closed · opens {time}", {
                time: hourLabel(settings.openHour),
              })}
      </p>
      <p className="mt-3 text-sm">{t("Floodlit after dark.")}</p>
    </div>
  );
}
