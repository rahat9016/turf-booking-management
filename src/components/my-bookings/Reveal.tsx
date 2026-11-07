"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/src/constants";

/** Fade-and-rise used for each result block; `delay` staggers blocks after a search. */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
