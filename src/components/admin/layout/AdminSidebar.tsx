"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, RotateCcw } from "lucide-react";
import { TurfLogo } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { ADMIN_NAV, isActive, type NavBadge, type NavItem } from "./navigation";

/** Sidebar menu; `rail` is the compact 80px icon-only version. */
export function AdminSidebar({
  rail,
  badges,
  onNavigate,
  onReset,
}: {
  rail: boolean;
  badges: Record<NavBadge, number>;
  onNavigate: () => void;
  onReset: () => void;
}) {
  const t = useT();
  const footerLink = cn(
    "rounded-md text-sm text-emerald-100/80 hover:bg-white/5 hover:text-white",
    rail
      ? "flex flex-col items-center gap-1 px-0.5 py-1.5 text-[10px]"
      : "flex items-center gap-3 px-3 py-2"
  );

  return (
    <nav className="flex h-full flex-col">
      <Link
        href={ROUTES.adminBookings}
        onClick={onNavigate}
        className={cn(
          "block",
          rail ? "px-2 pb-1 pt-5 text-center" : "px-5 pb-1 pt-5"
        )}
      >
        {rail ? (
          <span className="text-xl font-extrabold text-lime-400">
            T<span className="text-white">H</span>
          </span>
        ) : (
          <TurfLogo />
        )}
      </Link>
      <div
        className={cn(
          "mt-5 flex-1 overflow-y-auto pb-4",
          rail ? "space-y-2 px-1.5" : "space-y-5 px-3"
        )}
      >
        {ADMIN_NAV.map((g, gi) => (
          <div
            key={g.title}
            className={cn(rail && gi > 0 && "border-t border-white/10 pt-2")}
          >
            {!rail && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/40">
                {t(g.title)}
              </p>
            )}
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  rail={rail}
                  count={item.badge ? badges[item.badge] : 0}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className={cn(
          "space-y-0.5 border-t border-white/10",
          rail ? "p-1.5" : "p-3"
        )}
      >
        <Link
          href={ROUTES.home}
          target="_blank"
          title={rail ? t("View booking site") : undefined}
          className={footerLink}
        >
          <ExternalLink className="size-4" />{" "}
          {rail ? t("Site") : t("View booking site")}
        </Link>
        <button
          onClick={onReset}
          title={rail ? t("Reset demo data") : undefined}
          className={cn("w-full", footerLink)}
        >
          <RotateCcw className="size-4" />{" "}
          {rail ? t("Reset") : t("Reset demo data")}
        </button>
      </div>
    </nav>
  );
}

function SidebarLink({
  item,
  rail,
  count,
  onNavigate,
}: {
  item: NavItem;
  rail: boolean;
  count: number;
  onNavigate: () => void;
}) {
  const t = useT();
  const pathname = usePathname();
  const active = isActive(item.href, pathname);
  const badgeTone =
    item.badge === "refunds"
      ? "bg-violet-500 text-white"
      : active
        ? "bg-emerald-700 text-white"
        : "bg-emerald-500 text-white";
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={rail ? t(item.label) : undefined}
        className={cn(
          "rounded-md text-sm transition",
          rail
            ? "flex h-15 flex-col items-center justify-center gap-1 px-0.5 text-center"
            : "flex items-center gap-3 px-3 py-2.5",
          active
            ? "bg-white font-semibold text-emerald-950 shadow-sm"
            : "text-emerald-100/80 hover:bg-white/5 hover:text-white"
        )}
      >
        <span className="relative">
          <item.icon
            className={cn(
              rail ? "size-5" : "size-4",
              active && "text-emerald-700"
            )}
          />
          {rail && count > 0 && (
            <span
              className={cn(
                "absolute -right-2 -top-1.5 min-w-4 rounded-full px-1 text-center text-[9px] font-bold leading-4 tabular-nums",
                badgeTone
              )}
            >
              {count}
            </span>
          )}
        </span>
        <span
          className={cn(rail && "w-full truncate text-[10px] leading-tight")}
        >
          {t(item.label)}
        </span>
        {!rail && count > 0 && (
          <span
            className={cn(
              "ml-auto rounded-md px-1.5 text-[10px] font-bold tabular-nums",
              badgeTone
            )}
          >
            {count}
          </span>
        )}
      </Link>
    </li>
  );
}
