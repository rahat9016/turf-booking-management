import { initials } from "@/src/lib/format";

/** Initials in a green circle. */
export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-800"
    >
      {initials(name)}
    </span>
  );
}
