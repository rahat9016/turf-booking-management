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
  // Played and cancelled games aren't listed — a code lookup still shows that one booking.
  const featured = query?.kind === "code" ? mine[0] : upcoming[0];
  const more = query?.kind === "phone" ? upcoming.slice(1) : [];
  const empty = query?.kind === "phone" ? !upcoming.length : !mine.length;

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
          {empty && (
            <Reveal className="mt-12 text-center">
              <p className="text-lg font-medium text-neutral-900">
                {query.kind === "phone"
                  ? tr("No upcoming bookings on this number.")
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

          {more.length > 0 && (
            <Reveal delay={0.25} className="mt-12">
              <p className="border-b border-neutral-200 pb-3 text-sm font-semibold text-neutral-900">
                {tr("More upcoming")} ({more.length})
              </p>
              <ul className="divide-y divide-neutral-200">
                {more.map((b, i) => (
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
