import type { Court, Settings, SiteContent } from "@/src/types";
import { update } from "../db";

// These patches merge into the latest copy, so the Content and Settings pages never overwrite
// each other's fields with what they loaded earlier.

export function updateCourt(id: string, patch: Partial<Court>) {
  update((s) => ({
    ...s,
    courts: s.courts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  }));
}

export function saveSettings(patch: Partial<Settings>) {
  update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function saveContent(content: SiteContent) {
  update((s) => ({ ...s, content }));
}
