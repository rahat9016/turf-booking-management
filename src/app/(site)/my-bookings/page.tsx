import { Suspense } from "react";
import { Loader } from "@/src/components/common";
import { MyBookings } from "@/src/components/my-bookings/MyBookings";

export const metadata = { title: "My Bookings | TurfHub" };

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <MyBookings />
    </Suspense>
  );
}
