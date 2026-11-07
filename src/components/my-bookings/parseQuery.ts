import { BD_PHONE } from "@/src/constants";

/** What the visitor is looking up: every booking on a mobile number, or a single booking by its code. */
export type LookupMode = "phone" | "code";
export type Query = { kind: LookupMode; value: string } | null;

/** "01712345678" → phone; "TH-1042", "th1042" or "1042" → code "TH-1042". */
export function parseQuery(raw: string): Query | { error: string } {
  const v = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!v) return { error: "Enter your mobile number or booking code." };
  // Booking codes never start with 0, so a leading 0 always means a mobile number.
  if (/^\+?(88)?0[\d-]*$/.test(v)) {
    const digits = v.replace(/\D/g, "").replace(/^88/, "");
    return BD_PHONE.test(digits)
      ? { kind: "phone", value: digits }
      : {
          error:
            "That mobile number doesn't look right — use 11 digits, e.g. 01712345678.",
        };
  }
  const code = v.match(/^(?:TH-?)?(\d{3,6})$/);
  if (code) return { kind: "code", value: `TH-${code[1]}` };
  return {
    error:
      "Enter an 11-digit mobile number (01XXXXXXXXX) or a booking code like TH-1042.",
  };
}
