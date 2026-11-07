"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";

const navBtn =
  "flex size-8 items-center justify-center rounded-md border border-neutral-200 hover:border-emerald-400 disabled:opacity-40";

/** "1–20 of 57 bookings" with page buttons; takes the result of `usePagination`. */
export function Pager({
  page,
  pages,
  setPage,
  from,
  to,
  total,
  noun = "items",
}: {
  page: number;
  pages: number;
  setPage: (n: number) => void;
  from: number;
  to: number;
  total: number;
  noun?: string;
}) {
  const tr = useT();
  if (!total) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 text-sm text-neutral-500">
      <p>
        <b className="text-neutral-800">{from}</b>–
        <b className="text-neutral-800">{to}</b> {tr("of")}{" "}
        <b className="text-neutral-800">{total}</b> {tr(noun)}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label={tr("Previous page")}
            className={navBtn}
          >
            <ChevronLeft className="size-4" />
          </button>
          {nums.map((n, i) => (
            <span key={n} className="flex items-center gap-1">
              {i > 0 && n - nums[i - 1] > 1 && (
                <span className="px-1 text-neutral-400">…</span>
              )}
              <button
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "size-8 rounded-md text-xs font-medium",
                  n === page
                    ? "bg-emerald-700 text-white"
                    : "border border-neutral-200 hover:border-emerald-400"
                )}
              >
                {n}
              </button>
            </span>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pages}
            aria-label={tr("Next page")}
            className={navBtn}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
