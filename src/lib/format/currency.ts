/** Taka amount, e.g. `৳1,980` or `-৳500`. */
export const taka = (n: number) =>
  `${n < 0 ? "-" : ""}৳${Math.abs(n).toLocaleString("en-IN")}`;
