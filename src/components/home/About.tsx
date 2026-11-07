"use client";

import { hourLabel } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const players = [
  {
    who: "Weekend squads",
    what: "Same group, same slot every week — book your regular time well ahead and pay the advance in seconds.",
  },
  {
    who: "Office teams",
    what: "After-work matches and corporate leagues. Need the whole evening? We block the ground for you.",
  },
  {
    who: "Kids & coaching",
    what: "Morning sessions on a soft, shock-padded surface, with a coach on request.",
  },
];

export function About() {
  const { settings, content } = useTurfDB();
  const tr = useT();

  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 md:px-8 md:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="whitespace-pre-line text-fluid-5xl font-semibold tracking-tight text-neutral-900">
            {tr(content.aboutTitle)}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">
            {tr(content.aboutText)}
          </p>

          <ul className="mt-8 border-t border-neutral-200 md:mt-10">
            {players.map((p, i) => (
              <li
                key={p.who}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-neutral-200 py-5"
              >
                <span className="pt-0.5 text-sm tabular-nums text-neutral-400">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">{tr(p.who)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                    {tr(p.what)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 self-start">
          <AboutPhoto
            className="mt-12"
            src="/turf/player.webp"
            alt={tr("Player striking the ball on the turf")}
            title={tr("By day")}
            text={tr("FIFA-grade grass with a true roll.")}
          />
          <AboutPhoto
            src="/turf/night-match.webp"
            alt={tr("Night match under floodlights")}
            title={tr("After dark")}
            text={tr("floodlit until {time}.", {
              time: hourLabel(settings.closeHour),
            })}
          />
        </div>
      </div>

      <AboutFacts />
    </section>
  );
}

function AboutPhoto({
  src,
  alt,
  title,
  text,
  className,
}: {
  src: string;
  alt: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="aspect-[3/4] w-full rounded-lg object-cover"
      />
      <figcaption className="mt-3 text-sm text-neutral-500">
        <span className="font-medium text-neutral-900">{title}</span> — {text}
      </figcaption>
    </figure>
  );
}

/** Four big numbers along the bottom: hours, floodlights, hold time, booking window. */
function AboutFacts() {
  const { settings } = useTurfDB();
  const tr = useT();
  const facts = [
    {
      v: tr("{n} hrs", { n: settings.closeHour - settings.openHour }),
      t: tr("Open every day"),
      d: tr("{from} to {to}", {
        from: hourLabel(settings.openHour),
        to: hourLabel(settings.closeHour),
      }),
    },
    {
      v: hourLabel(settings.closeHour),
      t: tr("Floodlights until"),
      d: tr("Full LED lighting for night games"),
    },
    {
      v: tr("{n} min", { n: settings.holdMinutes }),
      t: tr("Slot held while you pay"),
      d: tr("Nobody can take it mid-checkout"),
    },
    {
      v: tr("{n} days", { n: settings.bookingWindowDays }),
      t: tr("Book ahead"),
      d: tr("Lock your regular slot early"),
    },
  ];
  return (
    <dl className="mt-10 grid grid-cols-2 border-t border-neutral-900 md:mt-16 lg:grid-cols-4">
      {facts.map((f, i) => (
        <div
          key={f.t}
          className={cn(
            "py-6 pr-4",
            i > 0 && "lg:border-l lg:border-neutral-200 lg:pl-6",
            i % 2 === 1 && "border-l border-neutral-200 pl-4 lg:pl-6"
          )}
        >
          <dd className="text-fluid-4xl font-semibold tracking-tight text-neutral-900">
            {f.v}
          </dd>
          <dt className="mt-2 text-sm font-medium text-neutral-900">{f.t}</dt>
          <p className="mt-0.5 text-sm text-neutral-500">{f.d}</p>
        </div>
      ))}
    </dl>
  );
}
