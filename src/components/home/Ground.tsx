"use client";

import { LiveDot } from "@/src/components/common";
import { useGround, useHydrated, useNow } from "@/src/hooks";
import { formatDuration, hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { courtLive, endMs, useTurfDB } from "@/src/lib/store";
import type { Court } from "@/src/types";
import { PitchPlan } from "./PitchPlan";

/** The one ground: photo with live status, pitch drawing + spec sheet. */
export function Ground() {
  const { settings } = useTurfDB();
  const ground = useGround();
  const tr = useT();
  if (!ground) return null;

  const [format, dims] = ground.size.split(" · ");
  const specs = [
    { k: tr("Surface"), v: tr(ground.surface) },
    { k: tr("Squad size"), v: `${tr(format)} · ${tr(ground.players)}` },
    {
      k: tr("Hours"),
      v: tr("{from} – {to}, every day", {
        from: hourLabel(settings.openHour),
        to: hourLabel(settings.closeHour),
      }),
    },
    { k: tr("On site"), v: ground.features.map((f) => tr(f)).join(", ") },
    { k: tr("Player rating"), v: `${ground.rating} / 5` },
  ];

  return (
    <section id="ground" className="scroll-mt-24 bg-neutral-100/70">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <LiveGroundPhoto ground={ground} />
          <div>
            <PitchPlan dims={dims} />
            <dl className="mt-6 divide-y divide-neutral-300 border-y border-neutral-300 text-sm">
              {specs.map((x) => (
                <div
                  key={x.k}
                  className="grid grid-cols-[120px_1fr] gap-4 py-3"
                >
                  <dt className="text-neutral-500">{x.k}</dt>
                  <dd className="text-neutral-900">{x.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Ground photo with a progress bar for the game in play and a caption on what's on now / next. */
function LiveGroundPhoto({ ground }: { ground: Court }) {
  const db = useTurfDB();
  const hydrated = useHydrated();
  const now = useNow(1000);
  const tr = useT();
  const { current, next } = hydrated
    ? courtLive(db, ground.id, now)
    : { current: undefined, next: undefined };
  const left = current ? endMs(current) - now : 0;
  const pct = current ? 100 - (left / (current.duration * 3600_000)) * 100 : 0;

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-emerald-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ground.image}
          alt={ground.name}
          className="size-full object-cover"
        />
        {current && (
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-lime-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 font-medium text-neutral-900">
          {current ? (
            <>
              <LiveDot />{" "}
              {tr("Match in play — {time} left", {
                time: formatDuration(left),
              })}
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-neutral-400" />{" "}
              {hydrated ? tr("Pitch is free right now") : tr("Checking…")}
            </>
          )}
        </span>
        <span className="text-neutral-500">
          {next
            ? tr("Next game {time}", { time: hourLabel(next.startHour) })
            : tr("No more games today")}
        </span>
      </figcaption>
    </figure>
  );
}
