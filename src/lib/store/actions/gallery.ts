import type { GalleryImage } from "@/src/types";
import { uid, update } from "../db";

export function addGalleryImage(img: Omit<GalleryImage, "id">) {
  update((s) => ({ ...s, gallery: [...s.gallery, { ...img, id: uid("gl") }] }));
}

export function updateGalleryImage(id: string, patch: Partial<GalleryImage>) {
  update((s) => ({
    ...s,
    gallery: s.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
  }));
}

export function removeGalleryImage(id: string) {
  update((s) => ({ ...s, gallery: s.gallery.filter((g) => g.id !== id) }));
}

/** Swap a photo with its neighbour; `dir` −1 moves it earlier, 1 later. */
export function moveGalleryImage(id: string, dir: -1 | 1) {
  update((s) => {
    const i = s.gallery.findIndex((g) => g.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= s.gallery.length) return s;
    const gallery = [...s.gallery];
    [gallery[i], gallery[j]] = [gallery[j], gallery[i]];
    return { ...s, gallery };
  });
}
