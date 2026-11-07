"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LandPlot, Phone, Plus, Ticket } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { telHref } from "@/src/lib/payment";
import { useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { IconType } from "@/src/types";

/**
 * App-style tab bar for phones and tablets: two tabs either side of a raised round "Book" button.
 * Hidden from `lg`, where the header shows the full menu.
 */
export function MobileBottomNav() {
  const t = useT();
  const pathname = usePathname();
  const { settings } = useTurfDB();
  const booking = pathname === ROUTES.book;

  return (
    <nav
      aria-label={t("Main")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-[4.5rem] max-w-lg grid-cols-5 items-end px-2 pb-2">
        <Tab
          href={ROUTES.home}
          label={t("Home")}
          icon={House}
          active={pathname === ROUTES.home}
        />
        <Tab href="/#ground" label={t("Ground")} icon={LandPlot} />
        <li className="flex justify-center">
          <Link
            href={ROUTES.book}
            aria-current={booking ? "page" : undefined}
            className="group -mt-7 flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-full bg-emerald-900 text-lime-300 shadow-lg shadow-emerald-950/30 ring-4 ring-white transition group-active:scale-95",
                booking && "bg-emerald-800"
              )}
            >
              <Plus className="size-7" strokeWidth={2.5} />
            </span>
            <span
              className={cn(
                "text-[11px] font-semibold",
                booking ? "text-emerald-800" : "text-neutral-900"
              )}
            >
              {t("Book")}
            </span>
          </Link>
        </li>
        <Tab
          href={ROUTES.myBookings}
          label={t("My Bookings")}
          icon={Ticket}
          active={pathname === ROUTES.myBookings}
        />
        <Tab
          href={telHref(settings.phone)}
          label={t("Call")}
          icon={Phone}
          external
        />
      </ul>
    </nav>
  );
}

function Tab({
  href,
  label,
  icon: Icon,
  active,
  external,
}: {
  href: string;
  label: string;
  icon: IconType;
  active?: boolean;
  external?: boolean;
}) {
  const className = cn(
    "flex flex-col items-center gap-1 rounded-md py-1 text-[11px] font-medium transition active:scale-95",
    active ? "text-emerald-800" : "text-neutral-500 hover:text-neutral-900"
  );
  const content = (
    <>
      <span className="relative">
        <Icon className={cn("size-6", active && "stroke-[2.25]")} />
        {active && (
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-emerald-700"
          />
        )}
      </span>
      <span className="max-w-full truncate">{label}</span>
    </>
  );
  return (
    <li className="min-w-0">
      {external ? (
        <a href={href} className={className}>
          {content}
        </a>
      ) : (
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={className}
        >
          {content}
        </Link>
      )}
    </li>
  );
}
