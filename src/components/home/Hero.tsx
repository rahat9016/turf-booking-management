"use client";

import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Wallet } from "lucide-react";
import { GiSoccerBall } from "react-icons/gi";
import { tbtn } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { useGround } from "@/src/hooks";
import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";
import type { IconType } from "@/src/types";
import { QuickBook } from "./quick-book/QuickBook";

export function Hero() {
  const { settings, content } = useTurfDB();
  const ground = useGround();
  const tr = useT();
  const facts: { icon: IconType; v: string; t: string }[] = [
    {
      icon: GiSoccerBall,
      v: ground
        ? tr("{format} ground", { format: tr(ground.size.split(" · ")[0]) })
        : tr("Football ground"),
      t: ground
        ? `${ground.size.split(" · ")[1] ?? ""} · ${tr(ground.players)}`
        : "",
    },
    {
      icon: Clock,
      v: `${hourLabel(settings.openHour)} – ${hourLabel(settings.closeHour)}`,
      t: tr("Open every day"),
    },
    {
      icon: Wallet,
      v: tr("{n}% advance", { n: settings.advancePercent }),
      t: tr("bKash, Nagad or card — rest at the venue"),
    },
    {
      icon: ShieldCheck,
      v: tr("Free cancellation"),
      t: tr("Up to {n} hours before kick-off", {
        n: settings.cancelCutoffHours,
      }),
    },
  ];

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-emerald-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.heroImage}
        alt=""
        className="absolute inset-0 size-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/55 to-emerald-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-emerald-950/60" />

      {/* Fills the viewport: content centred, facts row pinned to the bottom. On mobile only the slot picker shows. */}
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 pb-10 pt-28 max-md:content-start md:px-8 lg:grid-cols-[1fr_440px] lg:grid-rows-[1fr_auto] lg:items-center lg:pb-12 lg:pt-28">
        <div className="flex flex-col justify-center max-md:contents">
          <h1 className="max-md:sr-only whitespace-pre-line text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {tr(content.heroTitle)}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 max-md:hidden md:text-base">
            {tr(content.heroText)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 max-md:hidden">
            <Link href={ROUTES.book} className={tbtn.lime}>
              {tr("See live slots")} <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              {tr("How booking works")}
            </a>
          </div>
        </div>
        <QuickBook />

        <ul className="grid gap-3 border-t border-white/15 pt-6 max-md:hidden sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {facts.map((f) => (
            <li key={f.v} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lime-400 ring-1 ring-white/15">
                <f.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{f.v}</p>
                <p className="text-xs text-white/70">{f.t}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
