"use client";

import { Field, Group, inputClass } from "../../ui";
import type { VenueDraft } from "../draft";

export function VenueSection({
  venue,
  onChange,
}: {
  venue: VenueDraft;
  onChange: (k: keyof VenueDraft, v: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:gap-4">
      <Group title="Basics">
        <Field label="Venue name">
          <input
            value={venue.venueName}
            onChange={(e) => onChange("venueName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Address" className="mt-3">
          <input
            value={venue.address}
            onChange={(e) => onChange("address", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Group>
      <Group title="Contact">
        <Field label="Phone" hint="Also the bKash/Nagad number">
          <input
            value={venue.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Group>
    </div>
  );
}
