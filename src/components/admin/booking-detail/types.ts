export type DetailModal = "pay" | "refund" | "move" | "cancel";

/** What to do with money already paid when cancelling: refund it now, owe it, or keep it. */
export type MoneyChoice = "now" | "later" | "keep";
