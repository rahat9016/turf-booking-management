import { groundOf } from "@/src/lib/store";
import type { TurfDB } from "@/src/types";

export type ContentTab = "venue" | "hero" | "ground" | "services" | "about";

/** Splits "7-a-side · 180 × 90 ft" into its parts so staff edit plain fields, not the format string. */
export function splitSize(size: string) {
  const [format = "", dims = ""] = size.split(" · ");
  const [length = "", width = ""] = dims.replace(/ ft$/, "").split(" × ");
  return { format, length, width };
}

/** Joins the parts back into "7-a-side · 180 × 90 ft". */
export const joinSize = (format: string, length: string, width: string) =>
  [format, length && width ? `${length} × ${width} ft` : ""]
    .filter(Boolean)
    .join(" · ");

/** Everything this page edits, gathered from the three places it lives in the store. */
export function draftOf(db: TurfDB) {
  const g = groundOf(db);
  return {
    content: db.content,
    venue: {
      venueName: db.settings.venueName,
      phone: db.settings.phone,
      address: db.settings.address,
    },
    ground: g
      ? {
          name: g.name,
          image: g.image,
          surface: g.surface,
          players: g.players,
          features: g.features,
          ...splitSize(g.size),
        }
      : null,
  };
}

export type ContentDraft = ReturnType<typeof draftOf>;
export type VenueDraft = ContentDraft["venue"];
export type GroundDraft = NonNullable<ContentDraft["ground"]>;

/** Swaps item `i` with its neighbour in direction `dir`. */
export const move = <T>(xs: T[], i: number, dir: -1 | 1) => {
  const next = [...xs];
  [next[i], next[i + dir]] = [next[i + dir], next[i]];
  return next;
};

/** Trims every string field of an object. */
export const trimStrings = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(
    Object.entries(o).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
  ) as T;
