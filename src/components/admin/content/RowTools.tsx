"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { abtn } from "../ui";

/** Move up / move down / remove buttons for a row in an editable list. */
export function RowTools({
  i,
  length,
  onMove,
  onRemove,
}: {
  i: number;
  length: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const t = useT();
  return (
    <span className="flex shrink-0 gap-0.5">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={i === 0}
        aria-label={t("Move up")}
        className={abtn.icon}
      >
        <ArrowUp className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={i === length - 1}
        aria-label={t("Move down")}
        className={abtn.icon}
      >
        <ArrowDown className="size-4" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t("Remove")}
        className={abtn.iconDanger}
      >
        <Trash2 className="size-4" />
      </button>
    </span>
  );
}
