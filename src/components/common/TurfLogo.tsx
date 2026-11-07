import { cn } from "@/src/lib/utils";

export function TurfLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-2xl font-extrabold tracking-tight text-lime-400",
        className
      )}
    >
      Turf<span className="text-white">Hub</span>
    </span>
  );
}
