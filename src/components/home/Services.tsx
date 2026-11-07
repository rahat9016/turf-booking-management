"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useGround } from "@/src/hooks";
import { taka } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { telHref } from "@/src/lib/payment";
import { useTurfDB } from "@/src/lib/store";

type ServiceRowData = {
  title: string;
  text: string;
  detail: string;
  href: string;
  cta: string;
};

export function Services() {
  const { settings, content } = useTurfDB();
  const ground = useGround();
  const tr = useT();
  const tel = telHref(settings.phone);
  const services: ServiceRowData[] = content.services.map((x) => ({
    title: tr(x.title),
    text: tr(x.text),
    detail: x.detail
      ? tr(x.detail)
      : x.online
        ? ground
          ? tr("From {amount}/hr", { amount: taka(ground.price) })
          : tr("Book online")
        : "",
    href: x.online ? ROUTES.book : tel,
    cta: x.online ? tr("Book") : tr("Call to arrange"),
  }));
  if (!services.length) return null;

  return (
    <section id="services" className="scroll-mt-24 bg-emerald-950">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="whitespace-pre-line text-fluid-5xl font-semibold tracking-tight text-white">
            {tr("More than an hour\non the pitch.")}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/60 lg:justify-self-end">
            {tr(
              "Book a kickabout online in a minute. For coaching, events or a tournament, give us a call and we'll set it up."
            )}
          </p>
        </div>

        <ul className="mt-8 border-t border-white/15 md:mt-14">
          {services.map((x, i) => (
            <ServiceRow key={i} index={i} service={x} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** One service: a full-width row with a lime sweep on hover; online ones link to booking, others call the venue. */
function ServiceRow({
  service: x,
  index: i,
}: {
  service: ServiceRowData;
  index: number;
}) {
  const external = x.href.startsWith("tel:");
  const Row = external ? "a" : Link;
  return (
    <li className="border-b border-white/15">
      <Row
        href={x.href}
        className="group relative isolate grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 px-2 py-7 md:grid-cols-[3.5rem_1fr_1.4fr_10rem_3rem] md:px-4 lg:grid-cols-[3.5rem_1fr_1.4fr_10rem_11rem]"
      >
        {/* Lime sweep on hover */}
        <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-lime-400 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
        <span className="text-sm tabular-nums text-white/40 transition-colors duration-300 group-hover:text-emerald-950/60">
          0{i + 1}
        </span>
        <span className="text-fluid-3xl font-semibold text-white transition-colors duration-300 group-hover:text-emerald-950">
          {x.title}
        </span>
        <span className="col-start-2 row-start-2 text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-emerald-950/80 md:col-start-auto md:row-start-auto">
          {x.text}
        </span>
        <span className="hidden text-sm font-medium text-lime-300 transition-colors duration-300 group-hover:text-emerald-950 md:block">
          {x.detail}
        </span>
        <span className="col-start-3 row-span-2 row-start-1 flex items-center gap-3 md:col-start-auto md:row-span-1 md:row-start-auto md:justify-end">
          <span className="hidden text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-emerald-950 lg:inline">
            {x.cta}
          </span>
          <span className="flex size-11 items-center justify-center rounded-full ring-1 ring-white/25 transition duration-300 group-hover:bg-emerald-950 group-hover:ring-emerald-950">
            {external ? (
              <Phone className="size-4 text-white" />
            ) : (
              <ArrowRight className="size-4 -rotate-45 text-white transition-transform duration-300 group-hover:rotate-0" />
            )}
          </span>
        </span>
      </Row>
    </li>
  );
}
