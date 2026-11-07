"use client";

import { useT } from "@/src/lib/i18n";

/** Top-down drawing of the pitch with its dimensions, like a groundsman's plan. */
export function PitchPlan({ dims }: { dims?: string }) {
  const [length, width] = (dims ?? "").replace(/ ft$/, "").split(" × ");
  const tr = useT();
  return (
    <div className="rounded-lg bg-emerald-900 p-5">
      <svg
        viewBox="0 0 234 120"
        className="w-full text-white/80"
        fill="none"
        aria-label={dims ? `${tr("Pitch plan")}, ${dims}` : tr("Pitch plan")}
      >
        <g stroke="currentColor" strokeWidth="1">
          <rect x="10" y="14" width="200" height="96" />
          <path d="M110 14V110" />
          <circle cx="110" cy="62" r="14" />
          <path d="M10 38H34V86H10M210 38H186V86H210" />
          <path d="M10 50H18V74H10M210 50H202V74H210" />
          <path d="M6 54V70M214 54V70" strokeWidth="2" />
        </g>
        <circle cx="110" cy="62" r="1.5" fill="currentColor" />
        {length && (
          <g className="fill-lime-300 text-[7px]" stroke="none">
            <path
              d="M10 6H210"
              stroke="currentColor"
              strokeOpacity=".4"
              strokeDasharray="2 2"
            />
            <text
              x="110"
              y="8.5"
              textAnchor="middle"
              className="fill-lime-300"
              style={{ paintOrder: "stroke" }}
              stroke="#064e3b"
              strokeWidth="4"
            >
              {length} {tr("ft")}
            </text>
          </g>
        )}
        {width && (
          <text
            x="226"
            y="62"
            textAnchor="middle"
            transform="rotate(90 226 62)"
            className="fill-lime-300 text-[7px]"
          >
            {width} {tr("ft")}
          </text>
        )}
      </svg>
    </div>
  );
}
