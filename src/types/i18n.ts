/**
 * Language for the whole app — the booking site and its admin share one setting, so a visitor or staff
 * member who picks Bangla on one keeps it on the other.
 */
export type Lang = "en" | "bn";

export type TranslateVars = Record<string, string | number>;

/** Translator: looks a string up by its English text and fills `{name}` placeholders. */
export type T = (text: string, vars?: TranslateVars) => string;
