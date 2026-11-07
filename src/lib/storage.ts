import { STORAGE_KEYS } from "@/src/constants";

/** Mobile number the customer last booked or searched with, or "" when storage is unavailable. */
export function getSavedPhone() {
  try {
    return localStorage.getItem(STORAGE_KEYS.phone) ?? "";
  } catch {
    return "";
  }
}

export function savePhone(phone: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.phone, phone);
  } catch {}
}
