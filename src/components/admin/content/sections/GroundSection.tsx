"use client";

import { useT } from "@/src/lib/i18n";
import { AddButton, Field, Group, inputClass } from "../../ui";
import { type GroundDraft, move } from "../draft";
import { ListRow } from "../ListRow";
import { PhotoPicker } from "../PhotoPicker";
import { RowTools } from "../RowTools";

export function GroundSection({
  ground: g,
  onChange,
}: {
  ground: GroundDraft;
  onChange: (patch: Partial<GroundDraft>) => void;
}) {
  const t = useT();
  return (
    <div className="grid gap-3 sm:gap-4">
      <Group title="Basics">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Field label="Name">
            <input
              value={g.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Surface">
            <input
              value={g.surface}
              onChange={(e) => onChange({ surface: e.target.value })}
              placeholder={t("Artificial grass")}
              className={inputClass}
            />
          </Field>
        </div>
      </Group>
      <Group title="Size">
        <div className="grid gap-3 sm:grid-cols-4 sm:gap-4">
          <Field label="Format">
            <input
              value={g.format}
              onChange={(e) => onChange({ format: e.target.value })}
              placeholder={t("7-a-side")}
              className={inputClass}
            />
          </Field>
          <Field label="Players">
            <input
              value={g.players}
              onChange={(e) => onChange({ players: e.target.value })}
              placeholder={t("10–14 players")}
              className={inputClass}
            />
          </Field>
          <Field label="Length (ft)">
            <input
              value={g.length}
              inputMode="numeric"
              onChange={(e) =>
                onChange({ length: e.target.value.replace(/\D/g, "") })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Width (ft)">
            <input
              value={g.width}
              inputMode="numeric"
              onChange={(e) =>
                onChange({ width: e.target.value.replace(/\D/g, "") })
              }
              className={inputClass}
            />
          </Field>
        </div>
      </Group>
      <Group title="Facilities">
        <div className="space-y-2">
          {g.features.map((f, i) => (
            <ListRow
              key={i}
              n={i + 1}
              tools={
                <RowTools
                  i={i}
                  length={g.features.length}
                  onMove={(d) => onChange({ features: move(g.features, i, d) })}
                  onRemove={() =>
                    onChange({ features: g.features.filter((_, j) => j !== i) })
                  }
                />
              }
            >
              <input
                value={f}
                onChange={(e) =>
                  onChange({
                    features: g.features.map((x, j) =>
                      j === i ? e.target.value : x
                    ),
                  })
                }
                className={inputClass}
              />
            </ListRow>
          ))}
          <AddButton
            onClick={() => onChange({ features: [...g.features, ""] })}
          >
            {t("Add facility")}
          </AddButton>
        </div>
      </Group>
      <Group title="Photo">
        <PhotoPicker value={g.image} onChange={(v) => onChange({ image: v })} />
      </Group>
    </div>
  );
}
