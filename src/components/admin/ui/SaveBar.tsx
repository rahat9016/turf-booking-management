"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { abtn } from "./styles";

/** Editor save bar: sticks to the bottom of the card and turns green once something has changed. */
export function SaveBar({
  dirty,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const tr = useT();
  return (
    <div
      className={cn(
        "sticky bottom-0 flex items-center justify-between gap-2 rounded-b-md border-t px-3 py-2.5 backdrop-blur sm:px-6 sm:py-3",
        dirty
          ? "border-emerald-200 bg-emerald-50/95"
          : "border-neutral-100 bg-white/95"
      )}
    >
      <p
        className={cn(
          "min-w-0 truncate text-[13px] sm:text-sm",
          dirty ? "font-medium text-emerald-900" : "text-neutral-500"
        )}
      >
        {dirty ? tr("You have unsaved changes.") : tr("All changes saved")}
      </p>
      <div className="flex shrink-0 gap-2">
        {dirty && (
          <button
            type="button"
            onClick={onDiscard}
            className={cn(abtn.outline, "bg-white")}
          >
            {tr("Discard")}
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className={abtn.primary}
        >
          <span className="sm:hidden">{tr("Save")}</span>
          <span className="hidden sm:inline">{tr("Save changes")}</span>
        </button>
      </div>
    </div>
  );
}
