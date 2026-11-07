"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

/** Bottom sheet on phones, centred dialog from tablet width; Escape and the backdrop close it, focus returns to the opener. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && !e.defaultPrevented && close.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!panel.current?.contains(document.activeElement))
      panel.current?.focus();
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        ref={panel}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-clip rounded-t-lg bg-white shadow-2xl outline-none animate-in slide-in-from-bottom duration-200 sm:max-h-[90vh] sm:rounded-lg sm:slide-in-from-bottom-0 sm:zoom-in-95",
          wide ? "max-w-2xl" : "max-w-md",
          className
        )}
      >
        <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-4 pb-3.5 pt-5 sm:px-6 sm:pb-4 sm:pt-7">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-neutral-200 sm:hidden"
          />
          <h2 className="min-w-0 truncate text-base font-semibold text-neutral-900 sm:text-lg">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 [scrollbar-gutter:stable] sm:px-6 sm:pb-6 sm:pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Two-button footer row at the bottom of a modal (cancel + confirm). */
export function ModalActions({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4">
      {children}
    </div>
  );
}
