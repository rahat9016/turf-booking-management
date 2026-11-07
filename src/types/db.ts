import type { Block, Booking, Hold } from "./booking";
import type { GalleryImage, SiteContent } from "./content";
import type { Court } from "./court";
import type { Settings } from "./settings";

export type TurfDB = {
  version: number;
  seeded: boolean;
  settings: Settings;
  content: SiteContent;
  gallery: GalleryImage[];
  courts: Court[];
  bookings: Booking[];
  blocks: Block[];
  holds: Hold[];
  seq: { booking: number; court: number };
};
