/**
 * Takes whatever was pasted — the bare ID or the whole confirmation SMS ("… TrxID BJ74K3XQ2M at …")
 * — and returns the ID in canonical form.
 */
export function parseTrxId(text: string) {
  const fromSms = text.match(
    /\b(?:trx|txn)\s*id\s*[:#.-]?\s*([a-z0-9]{8,10})\b/i
  );
  return (fromSms ? fromSms[1] : text.replace(/[^a-z0-9]/gi, ""))
    .toUpperCase()
    .slice(0, 20);
}

/** The venue number as shown, and as wallet apps take it (local 11 digits). */
export const walletNumber = (phone: string) => ({
  shown: phone.replace(/^\+880\s?/, "0"),
  copy: phone.replace(/\D/g, "").replace(/^880/, "0"),
});

/** `tel:` link target for a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

/** Google Maps search link for an address. */
export const directionsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
