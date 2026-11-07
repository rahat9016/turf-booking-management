"use client";

import Image from "next/image";
import { Banknote, Check } from "lucide-react";
import { payLabels } from "@/src/constants";
import { plainT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import type { OnlinePayMethod, PayMethod, T } from "@/src/types";
import { payLogos, pickedTile, unpickedTile } from "./styles";

/** "Pay with" tiles: wallet and card logos, plus a cash tile where the desk takes cash. */
export function MethodTiles<M extends PayMethod>({
  methods,
  value,
  onChange,
  t = plainT,
}: {
  methods: M[];
  value: M;
  onChange: (m: M) => void;
  t?: T;
}) {
  return (
    <div className="flex gap-2">
      {methods.map((m) => {
        const on = value === m;
        return (
          <button
            type="button"
            key={m}
            onClick={() => onChange(m)}
            aria-pressed={on}
            aria-label={t(payLabels[m])}
            className={cn(
              "relative flex h-14 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border bg-white px-1.5 transition sm:gap-1.5 sm:px-3",
              on ? pickedTile : unpickedTile
            )}
          >
            {m === "cash" ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900">
                <Banknote className="size-5" /> {t("Cash")}
              </span>
            ) : (
              payLogos[m as OnlinePayMethod].map((l) => (
                <Image
                  key={l.src}
                  src={l.src}
                  alt=""
                  width={l.w}
                  height={l.h}
                  unoptimized={l.src.endsWith(".svg")}
                  className={cn(
                    "w-auto min-w-0 max-w-full object-contain",
                    l.cls
                  )}
                />
              ))
            )}
            {on && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-900 text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
