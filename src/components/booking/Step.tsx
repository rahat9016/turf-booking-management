import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function StepTitle({
  n,
  numbered,
  children,
}: {
  n: number;
  numbered?: boolean;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-semibold leading-10 text-neutral-900">
      {/* Phones drop the stepper rail, so the step number rides with the title; `numbered` keeps it on every size. */}
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-xs text-white",
          !numbered && "sm:hidden"
        )}
      >
        {n}
      </span>
      {children}
    </h2>
  );
}

/** One step of the vertical stepper: numbered circle, connector line down to the next step, content on the right. */
export function Step({
  n,
  state,
  last,
  children,
}: {
  n: number;
  state: "done" | "active";
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-x-4 sm:grid-cols-[2.5rem_1fr]">
      <div className="relative flex justify-center max-sm:hidden">
        <span
          className={cn(
            "relative z-10 flex size-10 items-center justify-center rounded-full text-sm font-semibold transition",
            state === "done"
              ? "bg-emerald-900 text-white"
              : "bg-white text-emerald-900 ring-2 ring-emerald-900"
          )}
        >
          {state === "done" ? (
            <Check className="size-5" strokeWidth={2.5} />
          ) : (
            String(n).padStart(2, "0")
          )}
        </span>
        {!last && (
          <span
            className={cn(
              "absolute bottom-0 top-10 w-0.5",
              state === "done" ? "bg-emerald-900" : "bg-neutral-200"
            )}
          />
        )}
      </div>
      <div
        className={cn(
          "min-w-0",
          !last &&
            "mb-6 border-b border-neutral-100 pb-6 sm:mb-0 sm:border-0 sm:pb-10"
        )}
      >
        {children}
      </div>
    </section>
  );
}
