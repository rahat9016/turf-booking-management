import type { ReactNode } from "react";
import { Plus } from "lucide-react";

/** Dashed full-width "+ Add …" button under an editable list. */
export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
    >
      <Plus className="size-4" /> {children}
    </button>
  );
}
