"use client";

import type { SiteContent } from "@/src/types";
import { Field, Group, textareaClass } from "../../ui";
import { PhotoPicker } from "../PhotoPicker";

type SetContent = <K extends keyof SiteContent>(
  k: K,
  v: SiteContent[K]
) => void;

export function HeroSection({
  content: c,
  onChange,
}: {
  content: SiteContent;
  onChange: SetContent;
}) {
  return (
    <div className="grid gap-3 sm:gap-4">
      <Group title="Text">
        <Field label="Headline">
          <textarea
            value={c.heroTitle}
            onChange={(e) => onChange("heroTitle", e.target.value)}
            rows={2}
            className={textareaClass}
          />
        </Field>
        <Field label="Intro" className="mt-3">
          <textarea
            value={c.heroText}
            onChange={(e) => onChange("heroText", e.target.value)}
            rows={3}
            className={textareaClass}
          />
        </Field>
      </Group>
      <Group title="Background photo">
        <PhotoPicker
          value={c.heroImage}
          onChange={(v) => onChange("heroImage", v)}
        />
      </Group>
    </div>
  );
}
