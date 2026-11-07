import { ROUTES } from "./routes";

export type NavLink = { href: string; label: string };

/** Main menu of the booking site's header. */
export const SITE_NAV_LINKS: NavLink[] = [
  { href: ROUTES.home, label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#ground", label: "The Ground" },
  { href: "/#gallery", label: "Gallery" },
  { href: ROUTES.myBookings, label: "My Bookings" },
];

/** Pages whose own dark top section runs behind the floating glass header; others get a solid header bar. */
export const DARK_TOP_PAGES: string[] = [ROUTES.home, ROUTES.myBookings];

/** "Explore" column of the site footer. */
export const FOOTER_LINKS: NavLink[] = [
  { href: ROUTES.book, label: "Book a slot" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#ground", label: "The ground" },
  { href: ROUTES.myBookings, label: "My bookings" },
];
