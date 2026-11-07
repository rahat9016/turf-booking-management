import {
  ClipboardList,
  LayoutDashboard,
  Image as ImageIcon,
  LayoutTemplate,
  Settings,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/src/constants";
import type { IconType } from "@/src/types";

export type NavBadge = "today" | "refunds";
export type NavItem = {
  href: string;
  label: string;
  icon: IconType;
  badge?: NavBadge;
};

/** Front-desk work first, then what the public site shows. */
export const ADMIN_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Front desk",
    items: [
      {
        href: ROUTES.adminDashboard,
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: ROUTES.adminBookings,
        label: "Bookings",
        icon: ClipboardList,
        badge: "today",
      },
      {
        href: ROUTES.adminPayments,
        label: "Payments",
        icon: Wallet,
        badge: "refunds",
      },
    ],
  },
  {
    title: "Website",
    items: [
      { href: ROUTES.adminContent, label: "Content", icon: LayoutTemplate },
      { href: ROUTES.adminGallery, label: "Gallery", icon: ImageIcon },
    ],
  },
  {
    title: "System",
    items: [{ href: ROUTES.adminSettings, label: "Settings", icon: Settings }],
  },
];

export const isActive = (href: string, path: string) =>
  path === href || path.startsWith(`${href}/`);
