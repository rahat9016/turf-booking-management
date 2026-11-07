"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "./useHydrated";

/** Current time, re-rendering every `ms`. Returns 0 on the server so markup stays stable. */
export function useNow(ms = 15_000) {
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return hydrated ? now : 0;
}
