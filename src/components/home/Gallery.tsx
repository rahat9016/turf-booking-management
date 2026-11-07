"use client";

import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";

export function Gallery() {
  const { gallery } = useTurfDB();
  const photos = gallery.filter((g) => g.visible);
  const tr = useT();
  if (!photos.length) return null;

  return (
    <section
      id="gallery"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 md:px-8 md:py-20"
    >
      <h2 className="text-fluid-4xl font-semibold text-neutral-900">
        {tr("Life on the pitch")}
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {photos.map((g) => (
          <li
            key={g.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={tr(g.title)}
              loading="lazy"
              className="size-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
            {g.title && (
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 text-xs font-medium text-white md:text-sm">
                {tr(g.title)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
