"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";
import { cn } from "@/src/lib/utils";
import { abtn } from "../ui";

/** Back to the list the booking was opened from — Payments when it came from there, otherwise Bookings. */
export function BackButton() {
  const t = useT();
  const from = useSearchParams().get("from");
  return (
    <Link
      href={from === "payments" ? ROUTES.adminPayments : ROUTES.adminBookings}
      className={cn(abtn.outline, "w-full")}
    >
      <ArrowLeft className="size-4" /> {t("Back")}
    </Link>
  );
}
