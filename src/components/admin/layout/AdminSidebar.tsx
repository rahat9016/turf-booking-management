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
    "rounded-lg text-sm text-sky-50/70 hover:bg-sky-400/10 hover:text-white",
    rail
      ? "flex flex-col items-center gap-1 px-0.5 py-1.5 text-[10px]"
      : "flex h-11 items-center gap-3 px-4"
  );

  return (
    <nav className="relative flex h-full flex-col overflow-hidden">
      {/* Soft coloured glows behind the menu. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 size-56 rounded-full bg-sky-400/15 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/3 size-56 rounded-full bg-indigo-400/15 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-violet-500/15 blur-3xl"
      />
      <Link
        href={ROUTES.adminDashboard}
        onClick={onNavigate}
        className={cn(
          "relative block",
          rail ? "px-2 pb-1 pt-5 text-center" : "px-6 pb-1 pt-6"
        )}
      >
        {rail ? (
          <span className="text-xl font-extrabold text-sky-400">
            T<span className="text-white">H</span>
          </span>
        ) : (
          <TurfLogo />
        )}
      </Link>
      <div
        className={cn(
          "relative mt-5 flex-1 overflow-y-auto pb-4",
          rail ? "space-y-2 px-1.5" : "space-y-6 px-4"
        )}
      >
        {ADMIN_NAV.map((g, gi) => (
          <div
            key={g.title}
            className={cn(rail && gi > 0 && "border-t border-white/10 pt-2")}
          >
            {!rail && (
              <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/60">
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
          "relative space-y-0.5 border-t border-white/10",
          rail ? "p-1.5" : "p-4"
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
      ? "bg-indigo-400 text-white"
      : "bg-sky-400 text-sky-950";
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
            ? "flex h-16 flex-col items-center justify-center gap-1 px-0.5 text-center"
            : "flex h-12 items-center gap-3 rounded-lg px-2.5 text-[15px]",
          active
            ? "bg-gradient-to-r from-sky-400/25 to-indigo-400/5 font-semibold text-white ring-1 ring-inset ring-sky-300/25"
            : "text-white/85 hover:bg-sky-400/10 hover:text-white"
        )}
      >
        <span
          className={cn(
            "relative flex size-8 shrink-0 items-center justify-center rounded-lg transition",
            active
              ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md"
              : "bg-white/[0.07] text-sky-300 ring-1 ring-white/10"
          )}
        >
          <item.icon className="size-[18px]" />
          {rail && count > 0 && (
            <span
              className={cn(
                "absolute -right-2 -top-1.5 min-w-4 rounded px-1 text-center text-[9px] font-bold leading-4 tabular-nums",
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
