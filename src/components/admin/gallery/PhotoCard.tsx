"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useT } from "@/src/lib/i18n";
import { moveGalleryImage, updateGalleryImage } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { GalleryImage } from "@/src/types";

const iconBtn =
  "flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-emerald-700 disabled:opacity-40";
const menuItem = "cursor-pointer py-2.5";

/** One gallery photo. Phones: every action in one menu button; with a mouse: a row of buttons on hover. */
export function PhotoCard({
  g,
  index,
  count,
  onEdit,
  onRemove,
}: {
  g: GalleryImage;
  index: number;
  count: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const t = useT();
  const first = index === 0;
  const last = index === count - 1;
  const toggle = () => updateGalleryImage(g.id, { visible: !g.visible });
  const visibilityLabel = g.visible ? t("Hide from site") : t("Show on site");

  return (
    <article className="group min-w-0">
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100",
          !g.visible &&
            "outline-dashed outline-2 outline-offset-2 outline-neutral-300"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
        <img
          src={g.src}
          alt={g.title}
          loading="lazy"
          className={cn(
            "size-full object-cover transition duration-300 group-hover:scale-[1.03]",
            !g.visible && "opacity-40 grayscale"
          )}
        />
        <span className="absolute left-2 top-2 rounded bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          {index + 1}
        </span>
        {!g.visible && (
          <span className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded bg-neutral-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            {t("Hidden")}
          </span>
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label={t("Actions")}
            className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-sm backdrop-blur sm:hidden"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-52 rounded-md"
          >
            <DropdownMenuItem onSelect={onEdit} className={menuItem}>
              <Pencil /> {t("Edit caption")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={toggle} className={menuItem}>
              {g.visible ? <EyeOff /> : <Eye />} {visibilityLabel}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={first}
              onSelect={() => moveGalleryImage(g.id, -1)}
              className={menuItem}
            >
              <ArrowLeft /> {t("Move earlier")}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={last}
              onSelect={() => moveGalleryImage(g.id, 1)}
              className={menuItem}
            >
              <ArrowRight /> {t("Move later")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={onRemove}
              className={menuItem}
            >
              <Trash2 /> {t("Delete photo")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="absolute inset-x-0 bottom-0 hidden items-center justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 sm:flex">
          <span className="flex gap-1">
            <button
              onClick={() => moveGalleryImage(g.id, -1)}
              disabled={first}
              aria-label={t("Move earlier")}
              className={iconBtn}
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => moveGalleryImage(g.id, 1)}
              disabled={last}
              aria-label={t("Move later")}
              className={iconBtn}
            >
              <ArrowRight className="size-4" />
            </button>
          </span>
          <span className="flex gap-1">
            <button
              onClick={toggle}
              aria-label={visibilityLabel}
              title={visibilityLabel}
              className={iconBtn}
            >
              {g.visible ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>
            <button
              onClick={onEdit}
              aria-label={t("Edit caption")}
              className={iconBtn}
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={onRemove}
              aria-label={t("Delete photo")}
              className={cn(iconBtn, "hover:text-rose-600")}
            >
              <Trash2 className="size-4" />
            </button>
          </span>
        </div>
      </div>
      {g.title && (
        <p
          className={cn(
            "mt-1.5 truncate px-0.5 text-[13px] font-semibold sm:text-sm",
            g.visible ? "text-neutral-900" : "text-neutral-500"
          )}
        >
          {g.title}
        </p>
      )}
    </article>
  );
}
