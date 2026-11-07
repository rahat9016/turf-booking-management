"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useT } from "@/src/lib/i18n";
import {
  groundOf,
  saveContent,
  saveSettings,
  updateCourt,
  useTurfDB,
} from "@/src/lib/store";
import type { SiteContent } from "@/src/types";
import { SaveBar, type TabItem, Tabs, ToolbarSelect } from "../ui";
import {
  type ContentDraft,
  type ContentTab,
  draftOf,
  type GroundDraft,
  joinSize,
  trimStrings,
  type VenueDraft,
} from "./draft";
import { AboutSection } from "./sections/AboutSection";
import { GroundSection } from "./sections/GroundSection";
import { HeroSection } from "./sections/HeroSection";
import { ServicesSection } from "./sections/ServicesSection";
import { VenueSection } from "./sections/VenueSection";

export function ContentManager() {
  const t = useT();
  const db = useTurfDB();
  const [tab, setTab] = useState<ContentTab>("venue");
  const [draft, setDraft] = useState<ContentDraft>(() => draftOf(db));
  const saved = draftOf(db);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const c = draft.content;
  const g = draft.ground;
  const setContent = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) =>
    setDraft((d) => ({ ...d, content: { ...d.content, [k]: v } }));
  const setVenue = (k: keyof VenueDraft, v: string) =>
    setDraft((d) => ({ ...d, venue: { ...d.venue, [k]: v } }));
  const setGround = (patch: Partial<GroundDraft>) =>
    setDraft((d) => ({ ...d, ground: d.ground && { ...d.ground, ...patch } }));

  const save = () => {
    if (!c.heroTitle.trim())
      return toast.error(t("The hero headline can't be empty"));
    if (!draft.venue.venueName.trim() || !draft.venue.phone.trim())
      return toast.error(t("Venue name and phone are required"));
    if (g && !g.name.trim()) return toast.error(t("The ground needs a name"));
    // Keep the cleaned copy as the draft so the bar reads "All changes saved" afterwards.
    const clean: ContentDraft = {
      content: { ...c, services: c.services.filter((s) => s.title.trim()) },
      venue: trimStrings(draft.venue),
      ground: g && {
        ...trimStrings(g),
        features: g.features.map((f) => f.trim()).filter(Boolean),
      },
    };
    saveContent(clean.content);
    saveSettings(clean.venue);
    const ground = groundOf(db);
    if (clean.ground && ground) {
      const { format, length, width, ...rest } = clean.ground;
      updateCourt(ground.id, {
        ...rest,
        size: joinSize(format, length, width),
      });
    }
    setDraft(clean);
    toast.success(t("Content saved — the site shows it right away"));
  };

  const sections: TabItem<ContentTab>[] = [
    { value: "venue", label: "Venue info" },
    { value: "hero", label: "Homepage hero" },
    ...(g
      ? [
          {
            value: "ground" as const,
            label: "The ground",
            count: g.features.length,
          },
        ]
      : []),
    { value: "services", label: "Services", count: c.services.length },
    { value: "about", label: "About" },
  ];

  return (
    <div>
      <section className="rounded-md border border-neutral-200 bg-white">
        {/* Phones: the sections as one dropdown, so none hide off-screen. */}
        <div className="border-b border-neutral-100 p-3 sm:hidden">
          <ToolbarSelect
            label="Section"
            value={tab}
            onChange={setTab}
            options={sections.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>
        <div className="hidden sm:block">
          <Tabs value={tab} onChange={setTab} tabs={sections} />
        </div>

        <div className="p-3 sm:p-6">
          {tab === "venue" && (
            <VenueSection venue={draft.venue} onChange={setVenue} />
          )}
          {tab === "hero" && <HeroSection content={c} onChange={setContent} />}
          {tab === "ground" && g && (
            <GroundSection ground={g} onChange={setGround} />
          )}
          {tab === "services" && (
            <ServicesSection
              services={c.services}
              onChange={(s) => setContent("services", s)}
            />
          )}
          {tab === "about" && (
            <AboutSection content={c} onChange={setContent} />
          )}
        </div>

        <SaveBar
          dirty={dirty}
          onSave={save}
          onDiscard={() => setDraft(saved)}
        />
      </section>
    </div>
  );
}
