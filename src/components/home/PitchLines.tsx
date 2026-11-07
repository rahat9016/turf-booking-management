/**
 * Strip of penalty-box markings along the bottom of each step card. On hover the lines redraw in lime
 * and the ball rolls along the pitch to the penalty spot.
 */
export function PitchLines({ className }: { className?: string }) {
  const draw =
    "[stroke-dasharray:1] motion-safe:group-hover:[animation:pitch-draw_0.9s_ease-out_both]";
  return (
    <div className={className}>
      <svg
        viewBox="0 0 240 64"
        fill="none"
        aria-hidden
        className="h-16 w-full text-emerald-900/15 transition-colors duration-500 group-hover:text-lime-400/60"
      >
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {/* Goal line, penalty box, six-yard box and arc */}
          <path pathLength={1} className={draw} d="M238 2V62" />
          <path pathLength={1} className={draw} d="M238 8H178V56H238" />
          <path pathLength={1} className={draw} d="M238 20H216V44H238" />
          <path pathLength={1} className={draw} d="M178 22a14 14 0 0 0 0 20" />
        </g>
        <circle cx="198" cy="32" r="1.8" fill="currentColor" />
        {/* Ball: starts on the left, rolls to the penalty spot on hover. */}
        <g className="transition-transform duration-700 ease-out [transform-box:fill-box] [transform-origin:center] motion-safe:group-hover:translate-x-[176px] motion-safe:group-hover:rotate-[540deg]">
          <circle cx="22" cy="32" r="7" fill="currentColor" />
          <path
            d="M22 27.5l3.8 2.8-1.5 4.4h-4.6l-1.5-4.4z"
            fill="white"
            fillOpacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
