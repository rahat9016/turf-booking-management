"use client";

import { useState } from "react";

/** Slices a list into pages; the page clamps itself when the list shrinks. */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  return {
    rows: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    pages,
    setPage,
    from: items.length ? (current - 1) * pageSize + 1 : 0,
    to: Math.min(current * pageSize, items.length),
    total: items.length,
  };
}
