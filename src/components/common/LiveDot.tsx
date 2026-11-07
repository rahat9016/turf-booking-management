import { cn } from "@/src/lib/utils";

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-lime-500" />
    </span>
  );
}
