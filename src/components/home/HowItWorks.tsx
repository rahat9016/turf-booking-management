"use client";

import Link from "next/link";
import { ArrowRight, Lock, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { tbtn } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";
import type { IconType } from "@/src/types";
import { PitchLines } from "./PitchLines";

type HowStep = { icon: IconType; title: string; text: string };

export function HowItWorks() {
  const { settings } = useTurfDB();
  const tr = useT();
  const steps: HowStep[] = [
    {
      icon: MapPin,
      title: tr("Pick date & time"),
      text: tr(
        "Open Live Slots and choose a day. You see right away which start times are free and which are taken."
      ),
    },
    {
      icon: Lock,
      title: tr("Slot held for {n} min", { n: settings.holdMinutes }),
      text: tr(
        "Enter your name and mobile number. While you pay, the slot is locked for you — nobody else can grab it."
      ),
    },
    {
      icon: Wallet,
      title: tr("Pay {n}% advance", { n: settings.advancePercent }),
      text: tr(
        "Pay the advance with bKash, Nagad or card. The rest is paid in cash or bKash at the venue."
      ),
    },
    {
      icon: ShieldCheck,
      title: tr("Get confirmed & play"),
      text: tr(
        "Your booking is confirmed the moment you pay. Find it any time under My Bookings with your phone number."
      ),
    },
  ];
  return (
    <section
      id="how-it-works"
      className="mx-auto grid max-w-7xl scroll-mt-24 gap-x-4 gap-y-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:items-end md:gap-y-10 md:px-8 md:py-20"
    >
      <h2 className="max-w-xl text-fluid-4xl font-semibold text-neutral-900">
        {tr("How to book your turf")}
      </h2>
      {/* Phones: full-width button after the steps, once they've been read. */}
      <Link
        href={ROUTES.book}
        className={`${tbtn.green} max-sm:order-last max-sm:h-12 max-sm:w-full`}
      >
        {tr("Start booking")} <ArrowRight className="size-4" />
      </Link>
      <ol className="grid gap-5 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <StepCard key={s.title} step={s} index={i} />
        ))}
      </ol>
    </section>
  );
}

function StepCard({ step: s, index: i }: { step: HowStep; index: number }) {
  return (
    <li className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-5 transition duration-500 hover:-translate-y-1 hover:border-emerald-900 hover:bg-emerald-950 hover:shadow-xl hover:shadow-emerald-950/20 motion-reduce:hover:translate-y-0">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-lime-400 text-emerald-950 transition duration-500 group-hover:rotate-[360deg] motion-reduce:group-hover:rotate-0">
          <s.icon className="size-5" />
        </span>
        <span className="text-3xl font-semibold text-neutral-200 transition duration-500 group-hover:text-lime-400/40">
          0{i + 1}
        </span>
      </div>
      <p className="mt-4 font-semibold text-neutral-900 transition-colors duration-500 group-hover:text-white">
        {s.title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500 transition-colors duration-500 group-hover:text-white/70">
        {s.text}
      </p>
      {/* Own row at the bottom so it never sits under the text; mt-auto keeps equal card padding. */}
      <PitchLines className="mt-auto pt-3" />
    </li>
  );
}
