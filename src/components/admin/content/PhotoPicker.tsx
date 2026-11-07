"use client";

import { useT } from "@/src/lib/i18n";
import { turfImages, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

/** Picks from the stock venue photos and the gallery, so an uploaded gallery photo can be used here too. */
export function PhotoPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useT();
  const { gallery } = useTurfDB();
  const photos = [...new Set([...turfImages, ...gallery.map((g) => g.src)])];
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
      {photos.map((src, i) => (
        <button
          type="button"
          key={src}
          aria-label={t("Use photo {n}", { n: i + 1 })}
          aria-pressed={value === src}
          onClick={() => onChange(src)}
          className={cn(
            "overflow-hidden rounded-md ring-2 ring-offset-2 transition",
            value === src
              ? "ring-indigo-600"
              : "ring-transparent hover:ring-neutral-300"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
          <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
