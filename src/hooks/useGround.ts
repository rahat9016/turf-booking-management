"use client";

import { groundOf, useTurfDB } from "@/src/lib/store";

/** The venue's one ground (first active court), or undefined when none is open. */
export const useGround = () => groundOf(useTurfDB());
