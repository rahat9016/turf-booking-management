"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tbtn } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";

export function PrimeTimeCta() {
  const { settings } = useTurfDB();
  const tr = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-emerald-900 px-6 py-10 md:px-14 md:py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/turf/night.webp"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-fluid-5xl font-semibold text-white">
              {tr("Tonight's prime slots go fast.")}
            </h3>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              {tr(
                "Peak hours start at {time}. Check what's left before your squad does.",
                { time: hourLabel(settings.peakStartHour) }
              )}
            </p>
          </div>
          <Link href={ROUTES.book} className={tbtn.lime}>
            {tr("Check live slots")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
