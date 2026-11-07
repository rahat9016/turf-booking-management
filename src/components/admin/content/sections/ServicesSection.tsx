"use client";

import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { Service } from "@/src/types";
import { AddButton, inputClass, textareaClass } from "../../ui";
import { move } from "../draft";
import { ListRow } from "../ListRow";
import { RowTools } from "../RowTools";

const EMPTY_SERVICE: Service = {
  title: "",
  text: "",
  detail: "",
  online: false,
};

export function ServicesSection({
  services,
  onChange,
}: {
  services: Service[];
  onChange: (services: Service[]) => void;
}) {
  const t = useT();
  const setService = (i: number, patch: Partial<Service>) =>
    onChange(services.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="space-y-2">
      {services.map((s, i) => (
        <ListRow
          key={i}
          n={i + 1}
          tools={
            <RowTools
              i={i}
              length={services.length}
              onMove={(d) => onChange(move(services, i, d))}
              onRemove={() => onChange(services.filter((_, j) => j !== i))}
            />
          }
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              aria-label={t("Service name")}
              value={s.title}
              onChange={(e) => setService(i, { title: e.target.value })}
              placeholder={t("Service name")}
              className={inputClass}
            />
            <input
              aria-label={t("Short detail")}
              value={s.detail}
              onChange={(e) => setService(i, { detail: e.target.value })}
              placeholder={
                s.online
                  ? t("Empty shows the hourly price")
                  : t("e.g. Coach on request")
              }
              className={inputClass}
            />
            <textarea
              aria-label={t("Description")}
              value={s.text}
              onChange={(e) => setService(i, { text: e.target.value })}
              rows={2}
              placeholder={t("Description")}
              className={cn(textareaClass, "sm:col-span-2")}
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={s.online}
                onChange={(e) => setService(i, { online: e.target.checked })}
                className="size-4 accent-emerald-700"
              />
              {t("Booked online")}
            </label>
          </div>
        </ListRow>
      ))}
      <AddButton onClick={() => onChange([...services, EMPTY_SERVICE])}>
        {t("Add service")}
      </AddButton>
    </div>
  );
}
