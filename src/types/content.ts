export type Service = {
  title: string;
  text: string;
  /** Short line beside the title; empty on an online service shows the hourly price. */
  detail: string;
  /** Booked through the site; otherwise the row calls the venue. */
  online: boolean;
};

/** Home page copy the admin can edit. */
export type SiteContent = {
  heroTitle: string;
  heroText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  services: Service[];
};

/** Photo in the site's gallery section, shown in list order. */
export type GalleryImage = {
  id: string;
  /** Public path, https link, or a downscaled upload as a data URL. */
  src: string;
  title: string;
  visible: boolean;
};
