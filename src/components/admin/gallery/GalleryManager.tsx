"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { ImagePlus, Images } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { removeGalleryImage, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { GalleryImage } from "@/src/types";
import { abtn, cardClass, Empty, ViewPills } from "../ui";
import { AddPhotoModal } from "./AddPhotoModal";
import { EditPhotoModal } from "./EditPhotoModal";
import { PhotoCard } from "./PhotoCard";

type Filter = "all" | "shown" | "hidden";

export function GalleryManager() {
  const t = useT();
  const { gallery } = useTurfDB();
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [adding, setAdding] = useState(false);
  const list = gallery.filter(
    (g) => filter === "all" || (filter === "shown" ? g.visible : !g.visible)
  );
  const shown = gallery.filter((g) => g.visible).length;

  const remove = (g: GalleryImage) => {
    if (!confirm(t("Delete “{title}”?", { title: g.title || t("this photo") })))
      return;
    removeGalleryImage(g.id);
    toast.success(t("Photo deleted"));
  };

  return (
    <div>
      <div className={cn(cardClass, "mb-3 flex items-center gap-2 sm:mb-4")}>
        <div className="min-w-0 flex-1 [&>div]:border-b-0">
          <ViewPills
            label="Show"
            value={filter}
            onChange={setFilter}
            views={[
              { value: "all", label: "All", count: gallery.length, group: 0 },
              { value: "shown", label: "On the site", count: shown, group: 0 },
              {
                value: "hidden",
                label: "Hidden",
                count: gallery.length - shown,
                group: 0,
              },
            ]}
          />
        </div>
        <button
          onClick={() => setAdding(true)}
          aria-label={t("Add photos")}
          className={cn(
            abtn.primary,
            "mr-3 size-10 shrink-0 px-0 sm:w-auto sm:px-4"
          )}
        >
          <ImagePlus className="size-4" />{" "}
          <span className="hidden sm:inline">{t("Add photos")}</span>
        </button>
      </div>

      {list.length === 0 ? (
        <div className={cardClass}>
          <Empty
            icon={Images}
            title={gallery.length ? "No photos here" : "No photos yet"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {list.map((g) => (
            <PhotoCard
              key={g.id}
              g={g}
              index={gallery.findIndex((x) => x.id === g.id)}
              count={gallery.length}
              onEdit={() => setEditing(g)}
              onRemove={() => remove(g)}
            />
          ))}
        </div>
      )}

      {adding && <AddPhotoModal onClose={() => setAdding(false)} />}
      {editing && (
        <EditPhotoModal image={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
