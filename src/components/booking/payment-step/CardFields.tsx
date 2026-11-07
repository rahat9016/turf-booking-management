"use client";

import { FieldError, labelClass } from "@/src/components/common";
import { useT } from "@/src/lib/i18n";

export type CardForm = { number: string; exp: string; cvc: string };

/** Card number (grouped in fours), MM/YY expiry and CVC. */
export function CardFields({
  value: card,
  onChange,
  error,
  inputClassName,
}: {
  value: CardForm;
  onChange: (v: CardForm) => void;
  error?: string | false;
  inputClassName: string;
}) {
  const tr = useT();
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label htmlFor="pf-card" className={labelClass}>
          {tr("Card number")}
        </label>
        <input
          id="pf-card"
          className={inputClassName}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          value={card.number}
          onChange={(e) =>
            onChange({
              ...card,
              number: e.target.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(\d{4})(?=\d)/g, "$1 "),
            })
          }
        />
      </div>
      <div>
        <label htmlFor="pf-exp" className={labelClass}>
          {tr("Expiry")}
        </label>
        <input
          id="pf-exp"
          className={inputClassName}
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={card.exp}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
            onChange({
              ...card,
              exp: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v,
            });
          }}
        />
      </div>
      <div>
        <label htmlFor="pf-cvc" className={labelClass}>
          {tr("CVC")}
        </label>
        <input
          id="pf-cvc"
          className={inputClassName}
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="123"
          value={card.cvc}
          onChange={(e) =>
            onChange({
              ...card,
              cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
            })
          }
        />
      </div>
      <div className="col-span-2 -mt-1.5 empty:hidden">
        <FieldError message={error} />
      </div>
    </div>
  );
}
