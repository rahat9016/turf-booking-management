import type { ComponentType, ReactNode } from "react";

/** Any icon component (lucide, react-icons) that takes a className. */
export type IconType = ComponentType<{ className?: string }>;

export type WithChildren<P = object> = P & { children: ReactNode };

export type WithClassName<P = object> = P & { className?: string };
