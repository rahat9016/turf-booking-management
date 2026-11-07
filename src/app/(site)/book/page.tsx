import { Suspense } from "react";
import { SlotBooking } from "@/src/components/booking/SlotBooking";
import { Loader } from "@/src/components/common";

export const metadata = { title: "Live Slots | TurfHub" };

export default function BookPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SlotBooking />
    </Suspense>
  );
}
