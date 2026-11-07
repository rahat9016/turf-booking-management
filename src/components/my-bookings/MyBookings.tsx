"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader, PitchBackdrop, tbtn } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { useHydrated, useNow } from "@/src/hooks";
import { useT } from "@/src/lib/i18n";
import { getSavedPhone, savePhone } from "@/src/lib/storage";
import { endMs, startMs, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import type { Booking } from "@/src/types";
import { BookingRow } from "./BookingRow";
import { BookingTicket } from "./BookingTicket";
import { LookupForm } from "./LookupForm";
import { type LookupMode, parseQuery, type Query } from "./parseQuery";
import { Reveal } from "./Reveal";

type ListTab = "upcoming" | "past";

export function MyBookings() {
  const db = useTurfDB();
  const tr = useT();
  const hydrated = useHydrated();
  const now = useNow(1000);
  const params = useSearchParams();
  const freshCode = params.get("code");
  // The page renders a loader until hydrated, so reading storage in the initializers is safe.
  const [query, setQuery] = useState<Query>(() => {
    const p = getSavedPhone();
    return p
      ? { kind: "phone", value: p }
      : freshCode
        ? { kind: "code", value: freshCode }
        : null;
  });
  const [input, setInput] = useState(() => getSavedPhone() || freshCode || "");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<LookupMode>(() =>
    !getSavedPhone() && freshCode ? "code" : "phone"
  );
  const [tab, setTab] = useState<ListTab>("upcoming");
  // After a search, results appear under the form on the same page; scroll them into view.
  const scrollToResults = useRef(false);
  useEffect(() => {
    if (!scrollToResults.current) return;
    scrollToResults.current = false;
    document
      .getElementById("mb-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [query]);

  if (!hydrated) return <Loader />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseQuery(input);
    if (q && "error" in q) return setError(q.error);
    if (q && q.kind !== mode)
      return setError(
        mode === "phone"
          ? "Enter the 11-digit mobile number you booked with, e.g. 01712345678."
          : "Enter a booking code like TH-1042."
      );
    setError("");
    scrollToResults.current = true;
    setQuery(q);
    setTab("upcoming");
    if (q?.kind === "phone") savePhone(q.value);
  };

  const changeMode = (m: LookupMode) => {
    setMode(m);
    setInput("");
    setError("");
  };

  const changeInput = (v: string) => {
    // Typing letters means it's a code; a leading 0 means it's a phone number.
    if (mode === "phone" && /[a-z]/i.test(v)) setMode("code");
    if (mode === "code" && /^0/.test(v)) setMode("phone");
    setInput(v);
    setError("");
  };

  const mine =
    query?.kind === "phone"
      ? db.bookings.filter((b) => b.customer.phone === query.value)
      : query?.kind === "code"
        ? db.bookings.filter((b) => b.code === query.value)
        : [];
  const isUpcoming = (b: Booking) => endMs(b) > now && b.status !== "cancelled";
  const upcoming = mine
    .filter(isUpcoming)
    .sort((a, b) => startMs(a) - startMs(b));
  const past = mine
    .filter((b) => !isUpcoming(b))
    .sort((a, b) => startMs(b) - startMs(a));
  const featured = query?.kind === "code" ? mine[0] : upcoming[0];
  // Only tabs with bookings in them; the whole list disappears when there's nothing beyond the featured ticket.
  const groups = (
    [
      {
        k: "upcoming",
        label: tr("More upcoming"),
        items: upcoming.slice(query?.kind === "phone" ? 1 : 0),
      },
      { k: "past", label: tr("Past"), items: past },
    ] as const
  ).filter((g) => g.items.length > 0);
  const shown = groups.find((g) => g.k === tab) ?? groups[0];

  return (
    <div className="bg-neutral-50">
      {/* Search stays on top; with no search yet it fills the screen, after a search it shrinks and results follow below. */}
      <div
        className={cn(
          "relative isolate flex overflow-hidden bg-emerald-950 pt-32",
          query ? "pb-14" : "min-h-svh items-center pb-16"
        )}
      >
        <PitchBackdrop />
        <div className="mx-auto w-full max-w-2xl px-4 text-center">
          <h1 className="text-fluid-6xl font-semibold tracking-tight text-white">
            {tr("Find your booking")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">
            {tr(
              "Your mobile number shows every booking you've made. A booking code shows just that one."
            )}
          </p>
          <LookupForm
            mode={mode}
            onMode={changeMode}
            input={input}
            onInput={changeInput}
            error={error}
            autoFocus={!query}
            onSubmit={submit}
          />
        </div>
      </div>

      {query && (
        <div
          key={`${query.kind}:${query.value}`}
          id="mb-results"
          className="mx-auto min-h-[40vh] max-w-7xl scroll-mt-24 px-4 pb-20 pt-10 md:px-8"
        >
          {!mine.length && (
            <Reveal className="mt-12 text-center">
              <p className="text-lg font-medium text-neutral-900">
                {query.kind === "phone"
                  ? tr("No bookings on this number yet.")
                  : tr("No booking found with code {code}.", {
                      code: query.value,
                    })}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {query.kind === "phone"
                  ? tr("Booked with a different number? Change it above.")
                  : tr(
                      "Check the code, or look up with your mobile number instead."
                    )}
              </p>
              <Link href={ROUTES.book} className={cn(tbtn.green, "mt-6")}>
                {tr("Book a slot")}
              </Link>
            </Reveal>
          )}

          {featured && (
            <Reveal delay={0.05} className="mt-10">
              <BookingTicket b={featured} now={now} />
            </Reveal>
          )}

          {query.kind === "phone" && shown && (
            <Reveal delay={0.25} className="mt-12">
              <div className="flex gap-6 border-b border-neutral-200 text-sm">
                {groups.map((g) => (
                  <button
                    key={g.k}
                    onClick={() => setTab(g.k)}
                    aria-pressed={shown.k === g.k}
                    className={cn(
                      "-mb-px border-b-2 pb-3",
                      shown.k === g.k
                        ? "border-emerald-800 font-semibold text-neutral-900"
                        : "border-transparent text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    {g.label} ({g.items.length})
                  </button>
                ))}
              </div>
              {/* Keyed by tab so switching tabs replays the row stagger. */}
              <ul key={shown.k} className="divide-y divide-neutral-200">
                {shown.items.map((b, i) => (
                  <BookingRow key={b.id} b={b} index={i} />
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      )}
    </div>
  );
}
