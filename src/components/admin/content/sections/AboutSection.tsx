"use client";

import type { SiteContent } from "@/src/types";
import { Field, Group, textareaClass } from "../../ui";

type SetContent = <K extends keyof SiteContent>(
  k: K,
  v: SiteContent[K]
) => void;

export function AboutSection({
  content: c,
  onChange,
}: {
  content: SiteContent;
  onChange: SetContent;
}) {
  return (
    <Group title="About section">
      <Field label="Headline">
        <textarea
          value={c.aboutTitle}
          onChange={(e) => onChange("aboutTitle", e.target.value)}
          rows={2}
          className={textareaClass}
        />
      </Field>
      <Field label="Text" className="mt-3">
        <textarea
          value={c.aboutText}
          onChange={(e) => onChange("aboutText", e.target.value)}
          rows={5}
          className={textareaClass}
        />
      </Field>
    </Group>
  );
}
