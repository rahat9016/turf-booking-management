/** Every browser-storage key the app reads or writes, in one place. */
export const STORAGE_KEYS = {
  /** The demo database (localStorage). */
  db: "turfhub:db",
  /** Per-tab client id (sessionStorage). */
  clientId: "turfhub:client",
  /** Mobile number the customer last booked or searched with. */
  phone: "turfhub:phone",
  /** EN / বাংলা choice. */
  lang: "turf-lang",
  /** Admin sidebar collapsed to an icon rail. */
  adminSidebarCompact: "turf-admin-sidebar-compact",
  /** Front-desk notification list (this browser only). */
  adminNotifications: "turf-admin-notifications",
  /** "0" when the notification chime is muted. */
  adminSound: "turf-admin-sound",
} as const;

/** Window event fired when the language changes in this tab. */
export const LANG_EVENT = "turf-lang";
