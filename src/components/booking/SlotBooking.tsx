"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRight, Lock } from "lucide-react";
import { Loader, SlotLegend } from "@/src/components/common";
import { ROUTES } from "@/src/constants";
import { useHydrated, useNow } from "@/src/hooks";
import { addDays, slotTime, todayYmd } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { savePhone } from "@/src/lib/storage";
import {
  findConflict,
  freeSlots,
  getClientId,
  holdSlot,
  hoursOf,
  isPickable,
  quote,
  releaseHold,
  slotInfo,
  useTurfDB,
} from "@/src/lib/store";
import type { Court } from "@/src/types";
import { CourtSwitcher, type CourtView } from "./CourtSwitcher";
import { CourtMatrix } from "./kickoff/CourtMatrix";
import { KickoffGroups } from "./kickoff/KickoffGroups";
import { LengthPicker } from "./LengthPicker";
import { MatchTicket, ticketButton } from "./MatchTicket";
import { MobileProceedBar } from "./MobileProceedBar";
import { PaymentStep } from "./payment-step/PaymentStep";
import { PriceBreakdown } from "./PriceBreakdown";
import { Step, StepTitle } from "./Step";
import { WeekDayPicker } from "./WeekDayPicker";

export function SlotBooking() {
  const tr = useT();
  const db = useTurfDB();
  const hydrated = useHydrated();
  const now = useNow(1000);
  const router = useRouter();
  const params = useSearchParams();
  const [clientId] = useState(getClientId);

  const courts = db.courts.filter((c) => c.active);

  const [courtId, setCourtId] = useState(params.get("court") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [start, setStart] = useState<number | null>(
    params.get("start") ? Number(params.get("start")) : null
  );
  const [duration, setDuration] = useState(Number(params.get("duration")) || 1);
  const [view, setView] = useState<CourtView>("court");
  // With a single ground the ground picker and the all-courts grid add nothing.
  const multiCourt = courts.length > 1;
  const [paying, setPaying] = useState(false);
  // Week shown in the day picker; until the visitor pages, it follows the selected date.
  const [weekPick, setWeekPick] = useState<number | null>(null);

  const today = hydrated ? todayYmd() : "";
  const day = date || today;
  const days = hydrated
    ? Array.from({ length: db.settings.bookingWindowDays }, (_, i) =>
        addDays(today, i)
      )
    : [];
  const court = courts.find((c) => c.id === courtId) ?? courts[0];
  // Hours that have started can never be booked again, so today's grid only lists what is still ahead.
  const upcoming = hoursOf(db.settings).filter((h) => slotTime(day, h) > now);

  const myHold = db.holds.find(
    (h) => h.clientId === clientId && h.expiresAt > now
  );

  // A refresh mid-payment brings the customer straight back to the payment step.
  useEffect(() => {
    if (!myHold || paying) return;
    setCourtId(myHold.courtId);
    setDate(myHold.date);
    setStart(myHold.startHour);
    setDuration(myHold.duration);
    setPaying(true);
    // Only on first sight of the hold.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myHold?.id]);

  useEffect(() => {
    if (paying && hydrated && clientId && !myHold) {
      setPaying(false);
      toast.warn(
        tr("Your slot hold expired. Pick the slot again to continue.")
      );
    }
  }, [paying, myHold, hydrated, clientId, tr]);

  const selection =
    court && start !== null
      ? { courtId: court.id, date: day, startHour: start, duration }
      : null;
  const conflict =
    selection && hydrated
      ? findConflict(db, selection, { clientId, now })
      : null;
  const price =
    selection && court
      ? quote(court, selection.startHour, selection.duration, db.settings)
      : null;
  const peakHours = selection
    ? Array.from(
        { length: selection.duration },
        (_, i) => selection.startHour + i
      ).filter((h) => h >= db.settings.peakStartHour).length
    : 0;

  const pickDay = (d: string) => {
    setDate(d);
    setStart(null);
  };

  const pickCell = (c: Court, h: number) => {
    if (!isPickable(slotInfo(db, c, day, h, now, clientId))) return;
    setCourtId(c.id);
    setStart(h);
    // Keep the chosen length if it still fits, otherwise shrink to what does.
    let d = duration;
    while (
      d > 1 &&
      findConflict(
        db,
        { courtId: c.id, date: day, startHour: h, duration: d },
        { clientId, now }
      )
    )
      d--;
    setDuration(d);
  };

  const proceed = () => {
    if (!selection) return;
    const r = holdSlot(selection, clientId);
    if (!r.ok) {
      toast.error(tr(r.error));
      return;
    }
    setPaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hydrated || !clientId || !court) return <Loader />;

  const week = weekPick ?? Math.max(0, Math.floor(days.indexOf(day) / 7));
  const nextDay = days[days.indexOf(day) + 1];
  const isFull = (d: string) => freeSlots(db, court, d, now) === 0;

  return (
    <div className="bg-[#f7f6f1]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8 md:pt-10">
        {/* The payment step opens straight on the form; its heading stays for screen readers. */}
        {/* Not cn(): tailwind-merge reads text-fluid-6xl as a colour and drops it next to text-neutral-900. */}
        <h1
          className={`text-fluid-6xl font-semibold tracking-tight text-neutral-900 ${paying ? "sr-only" : ""}`}
        >
          {paying ? tr("Complete your booking") : tr("Book the ground")}
        </h1>
        {!paying && (
          <p className="mt-3 text-base text-neutral-500 md:text-lg">
            {tr("Pick your day. Choose your time. Get playing.")}
          </p>
        )}

        {paying && selection && price ? (
          <div>
            <PaymentStep
              court={court}
              selection={selection}
              price={price}
              expiresAt={myHold?.expiresAt ?? now}
              now={now}
              clientId={clientId}
              onBack={() => {
                releaseHold(clientId);
                setPaying(false);
              }}
              onDone={(code, phone) => {
                savePhone(phone);
                // Booking consumed the hold; leaving payment mode stops the "hold expired" warning from firing.
                setPaying(false);
                router.push(`${ROUTES.myBookings}?code=${code}`);
              }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-[1fr_440px] lg:items-start">
            {/* Steps */}
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/[0.04] sm:p-5 md:p-6">
              {multiCourt && (
                <CourtSwitcher
                  courts={courts}
                  courtId={court.id}
                  onCourt={(id) => {
                    setCourtId(id);
                    setStart(null);
                  }}
                  view={view}
                  onView={setView}
                />
              )}

              <Step n={1} state="done">
                <WeekDayPicker
                  days={days}
                  value={day}
                  week={week}
                  onWeek={setWeekPick}
                  isFull={isFull}
                  onPick={pickDay}
                  onCalendarPick={(d) => {
                    pickDay(d);
                    setWeekPick(null);
                  }}
                />
              </Step>

              <Step n={2} state="done">
                <LengthPicker
                  max={db.settings.maxDuration}
                  value={duration}
                  onChange={setDuration}
                  isBlocked={(d) =>
                    start !== null &&
                    !!findConflict(
                      db,
                      {
                        courtId: court.id,
                        date: day,
                        startHour: start,
                        duration: d,
                      },
                      { clientId, now }
                    )
                  }
                />
              </Step>

              <Step n={3} state={start !== null ? "done" : "active"} last>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <StepTitle n={3}>{tr("Pick your kick-off")}</StepTitle>
                  <SlotLegend className="flex-wrap gap-x-4 gap-y-1.5" />
                </div>

                {multiCourt && view === "all" ? (
                  <div className="mt-5">
                    <CourtMatrix
                      day={day}
                      now={now}
                      clientId={clientId}
                      selection={selection}
                      onPick={(c, h) => {
                        pickCell(c, h);
                        setView("court");
                      }}
                    />
                  </div>
                ) : upcoming.length === 0 ? (
                  <p className="mt-5 rounded-lg bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                    {tr("No kick-off times left on this day.")}{" "}
                    {nextDay && (
                      <button
                        onClick={() => pickDay(nextDay)}
                        className="font-semibold text-emerald-800 underline"
                      >
                        {tr("See the next day")}
                      </button>
                    )}
                  </p>
                ) : (
                  <KickoffGroups
                    court={court}
                    day={day}
                    hours={upcoming}
                    now={now}
                    clientId={clientId}
                    start={start}
                    duration={duration}
                    onPick={(h) => pickCell(court, h)}
                  />
                )}
              </Step>
            </div>

            <MatchTicket day={day} start={start} duration={duration}>
              <PriceBreakdown
                court={court}
                settings={db.settings}
                duration={duration}
                peakHours={peakHours}
                price={price}
              />
              {conflict && start !== null && (
                <p className="mt-2 rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-200">
                  {tr("That time was just taken. Pick another kick-off.")}
                </p>
              )}
              <button
                onClick={proceed}
                disabled={!selection || !!conflict}
                className={ticketButton}
              >
                {selection
                  ? tr("Continue to payment")
                  : tr("Pick a kick-off time")}{" "}
                <ArrowRight className="size-5" />
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/70">
                <Lock className="size-3.5" />{" "}
                {tr("Slot held for {n} minutes once you continue.", {
                  n: db.settings.holdMinutes,
                })}
              </p>
            </MatchTicket>
          </div>
        )}
      </div>

      {!paying && selection && price && !conflict && (
        <MobileProceedBar
          startHour={selection.startHour}
          duration={duration}
          advance={price.advance}
          onProceed={proceed}
        />
      )}
    </div>
  );
}
