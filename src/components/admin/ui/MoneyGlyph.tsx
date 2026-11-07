export type MoneyIcon = "wallet" | "calendar" | "bill" | "refund" | "vault";

const moneyIcons: Record<
  MoneyIcon,
  { paths: string[]; taka: [number, number] }
> = {
  wallet: {
    paths: [
      "M5 10h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z",
      "M8 10l11-4.5 2.5 4.5",
      "M27 15h-4.5a2.5 2.5 0 0 0 0 5H27",
    ],
    taka: [13, 22],
  },
  calendar: {
    paths: [
      "M6 8h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z",
      "M5 13h22",
      "M11 5v5M21 5v5",
    ],
    taka: [16, 23.5],
  },
  bill: {
    paths: [
      "M8 4h11l5 5v19l-2.5-1.5L19 28l-2.5-1.5L14 28l-2.5-1.5L9 28H8z",
      "M19 4v5h5",
    ],
    taka: [16, 20.5],
  },
  refund: {
    paths: ["M7.5 11.5A10 10 0 1 1 6 18", "M4 7.5l3.5 4.5 4.5-3"],
    taka: [16.5, 20.5],
  },
  vault: {
    paths: [
      "M8 14h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V15a1 1 0 0 1 1-1z",
      "M11 14v-3.5a5 5 0 0 1 10 0V14",
    ],
    taka: [16, 24.5],
  },
};

/** Line icon with a ৳ sign drawn inside it. */
export function MoneyGlyph({
  icon,
  className,
}: {
  icon: MoneyIcon;
  className?: string;
}) {
  const {
    paths,
    taka: [x, y],
  } = moneyIcons[icon];
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="currentColor"
        stroke="none"
      >
        ৳
      </text>
    </svg>
  );
}
