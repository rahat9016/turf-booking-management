import { Suspense } from "react";
import { BookingDetail } from "@/src/components/admin/booking-detail/BookingDetail";

export default async function AdminBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <BookingDetail id={id} />
    </Suspense>
  );
}
