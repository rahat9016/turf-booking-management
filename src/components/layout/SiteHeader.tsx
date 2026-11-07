"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { LanguageSwitch, TurfLogo } from "@/src/components/common";
import { DARK_TOP_PAGES, ROUTES, SITE_NAV_LINKS } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { telHref } from "@/src/lib/payment";
import { useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

/** Floating glass bar fixed over the page; turns more opaque once the page scrolls. */
export function SiteHeader() {
  const pathname = usePathname();
  const { settings } = useTurfDB();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const glass = DARK_TOP_PAGES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Over dark heroes it floats as glass; on light pages it is a solid full-width bar. */}
      <header
        className={
          glass
            ? "fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6"
            : "sticky top-0 z-40 bg-emerald-950"
        }
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-4 transition-all duration-300",
            !glass
              ? "h-20 px-4 md:px-8"
              : scrolled
                ? "bg-emerald-950/75 shadow-lg shadow-black/20 ring-white/15 backdrop-blur-xl backdrop-saturate-150"
                : // Home starts fully clear over the hero; the bar appears once the page scrolls.
                  pathname === ROUTES.home
                  ? "bg-transparent ring-transparent"
                  : "bg-white/[0.06] ring-white/15 backdrop-blur-xl backdrop-saturate-150",
            glass && "h-16 rounded-2xl px-3 ring-1 md:px-4"
          )}
        >
          <Link href={ROUTES.home} aria-label={t("TurfHub home")}>
            <TurfLogo />
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {SITE_NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  l.href === pathname
                    ? "bg-white text-emerald-950"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {t(l.label)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitch dark />
            <a
              href={telHref(settings.phone)}
              className="hidden items-center gap-2 rounded-full bg-white py-1 pl-4 pr-1 text-sm font-medium text-emerald-950 sm:flex"
            >
              {t("Contact")}
              <span className="flex size-8 items-center justify-center rounded-full bg-emerald-800 text-white">
                <Phone className="size-4" />
              </span>
            </a>
            <Link
              href={ROUTES.book}
              className="hidden h-10 items-center rounded-full bg-lime-400 px-5 text-sm font-semibold text-emerald-950 hover:bg-lime-300 md:flex"
            >
              {t("Book now")}
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={t("Toggle menu")}
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Floats below the bar so opening it never changes the header's height or pushes the page down. */}
        {open && <MobileMenu glass={glass} onClose={() => setOpen(false)} />}
      </header>
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
    </>
  );
}

function MobileMenu({
  glass,
  onClose,
}: {
  glass: boolean;
  onClose: () => void;
}) {
  const t = useT();
  return (
    <nav
      className={cn(
        "absolute top-full mx-auto mt-2 grid max-w-7xl gap-1 rounded-2xl bg-emerald-950/95 p-2 shadow-xl shadow-black/30 ring-1 ring-white/15 backdrop-blur-xl lg:hidden",
        glass ? "inset-x-3 md:inset-x-6" : "inset-x-3"
      )}
    >
      {SITE_NAV_LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className="rounded-xl px-4 py-3 text-sm text-white hover:bg-white/10"
        >
          {t(l.label)}
        </Link>
      ))}
      <Link
        href={ROUTES.admin}
        onClick={onClose}
        className="rounded-xl px-4 py-3 text-sm text-lime-300 hover:bg-white/10"
      >
        {t("Admin panel")}
      </Link>
    </nav>
  );
}
