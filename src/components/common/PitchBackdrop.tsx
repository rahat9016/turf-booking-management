/** Faint pitch markings (centre circle + halfway line) behind the dark bands. */
export function PitchBackdrop() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 -z-10 size-full text-white/5"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="2">
        <path d="M400 0V400" />
        <circle cx="400" cy="200" r="110" />
        <path d="M0 110H90V290H0M800 110H710V290H800" />
      </g>
      <circle cx="400" cy="200" r="5" fill="currentColor" />
    </svg>
  );
}
