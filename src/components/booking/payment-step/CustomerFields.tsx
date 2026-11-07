"use client";

import { FieldError, labelClass } from "@/src/components/common";
import { useT } from "@/src/lib/i18n";

export type CustomerForm = { name: string; phone: string };

/** Name and mobile number. */
export function CustomerFields({
  value,
  onChange,
  errors,
  inputClassName,
}: {
  value: CustomerForm;
  onChange: (v: CustomerForm) => void;
  errors: { name?: string | false; phone?: string | false };
  inputClassName: string;
}) {
  const tr = useT();
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="pf-name" className={labelClass}>
          {tr("Name")}
        </label>
        <input
          id="pf-name"
          className={inputClassName}
          placeholder={tr("Your full name")}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          autoComplete="name"
        />
        <FieldError message={errors.name} />
      </div>
      <div>
        <label htmlFor="pf-phone" className={labelClass}>
          {tr("Mobile number")}
        </label>
        <input
          id="pf-phone"
          type="tel"
          className={inputClassName}
          inputMode="numeric"
          placeholder="01XXXXXXXXX"
          value={value.phone}
          onChange={(e) =>
            onChange({
              ...value,
              phone: e.target.value.replace(/[^\d]/g, "").slice(0, 11),
            })
          }
          autoComplete="tel"
        />
        <FieldError message={errors.phone} />
      </div>
    </div>
  );
}
