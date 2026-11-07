/** Admin panel route base. */
export const ADMIN = "/admin";

export const ROUTES = {
  home: "/",
  book: "/book",
  myBookings: "/my-bookings",
  admin: ADMIN,
  adminDashboard: `${ADMIN}/dashboard`,
  adminBookings: `${ADMIN}/bookings`,
  adminNewBooking: `${ADMIN}/bookings/new`,
  adminPayments: `${ADMIN}/payments`,
  adminContent: `${ADMIN}/content`,
  adminGallery: `${ADMIN}/gallery`,
  adminSettings: `${ADMIN}/settings`,
  adminBooking: (id: string) => `${ADMIN}/bookings/${id}`,
} as const;
