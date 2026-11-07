/** Small lime step number beside a field label ("1 Date", "2 Start time"). */
export function StepBadge({ n }: { n: number }) {
  return (
    <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-lime-400 text-xs font-bold text-emerald-950">
      {n}
    </span>
  );
}
