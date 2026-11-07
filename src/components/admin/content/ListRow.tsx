import type { ReactNode } from "react";

/** A numbered row card: fields on the left (stacked on phones), order and delete on the right. */
export function ListRow({
  n,
  children,
  tools,
}: {
  n: number;
  children: ReactNode;
  tools: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2.5 sm:flex sm:items-start sm:gap-2 sm:p-2">
      <div className="mb-2 flex items-center justify-between sm:contents">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600 sm:order-first sm:mt-2">
          {n}
        </span>
        <div className="sm:order-last sm:mt-1">{tools}</div>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
