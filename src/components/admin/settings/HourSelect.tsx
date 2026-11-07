"use client";

import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { inputClass } from "../ui";

const HOURS = Array.from({ length: 25 }, (_, h) => h);

/** Hour of the day from `min` to `max`; 24 reads "Midnight". */
export function HourSelect({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (h: number) => void;
  min: number;
  max: number;
}) {
  const t = useT();
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputClass}
    >
      {HOURS.filter((h) => h >= min && h <= max).map((h) => (
        <option key={h} value={h}>
          {h === 24 ? t("Midnight") : hourLabel(h)}
        </option>
      ))}
    </select>
  );
}
