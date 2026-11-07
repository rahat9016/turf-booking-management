"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useNow } from "@/src/hooks";
import { useT } from "@/src/lib/i18n";
import { phaseOf, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import { abtn, cardClass, Empty } from "../ui";
import { CancelModal } from "./CancelModal";
import { CustomerPanel } from "./CustomerPanel";
import { MoneySummary } from "./MoneySummary";
import { PaymentModal } from "./PaymentModal";
import { RescheduleModal } from "./RescheduleModal";
import { SlotPanel } from "./SlotPanel";
import type { DetailModal } from "./types";

export function BookingDetail({ id }: { id: string }) {
  const t = useT();
  const db = useTurfDB();
  const now = useNow(30_000);
  const params = useSearchParams();
  // `?do=pay` / `?do=refund` (from the lists) open straight on that form.
  const [modal, setModal] = useState<DetailModal | null>(() => {
    const d = params.get("do");
    return d === "pay" || d === "refund" ? d : null;
  });
  const b = db.bookings.find((x) => x.id === id);

  if (!b)
    return (
      <div className={cardClass}>
        <Empty
          icon={ReceiptText}
          title="Booking not found"
          text="It may have been removed when the demo data was reset."
        >
          <Link
            href={ROUTES.adminBookings}
            className={cn(abtn.outline, "mt-2")}
          >
            {t("Back to bookings")}
          </Link>
        </Empty>
      </div>
    );

  const close = () => setModal(null);

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Phones: money and the next action come first; wider screens put them in a side column. */}
        <aside className="md:sticky md:top-20 md:col-start-2 md:row-start-1">
          <MoneySummary b={b} now={now} onOpen={setModal} />
        </aside>

        <div className="min-w-0 space-y-4 md:col-start-1 md:row-start-1">
          <SlotPanel
            b={b}
            canReschedule={phaseOf(b, now) === "booked"}
            onReschedule={() => setModal("move")}
          />
          <CustomerPanel b={b} />
        </div>
      </div>

      {(modal === "pay" || modal === "refund") && (
        <PaymentModal b={b} refund={modal === "refund"} onClose={close} />
      )}
      {modal === "move" && <RescheduleModal b={b} onClose={close} />}
      {modal === "cancel" && <CancelModal b={b} onClose={close} />}
    </div>
  );
}
