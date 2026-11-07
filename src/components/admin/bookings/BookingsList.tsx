"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { ROUTES } from "@/src/constants";
import { useNow, usePagination } from "@/src/hooks";
import { todayYmd } from "@/src/lib/format";
import { useT } from "@/src/lib/i18n";
import { phaseOf, startMs, useTurfDB } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import {
  abtn,
  Empty,
  PageHeader,
  Pager,
  SearchInput,
  table,
  tableCardClass,
  ToolbarSelect,
  ViewPills,
} from "../ui";
import { BookingListItem } from "./BookingListItem";
import { BookingTableRow } from "./BookingTableRow";
import { BOOKING_VIEWS, type BookingView, inView } from "./views";

export function BookingsList() {
  const t = useT();
  const db = useTurfDB();
  const [view, setView] = useState<BookingView>("all");
  const [q, setQ] = useState("");
  const now = useNow(60_000);
  const today = todayYmd();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return db.bookings.filter(
      (b) =>
        !term ||
        [b.code, b.customer.name, b.customer.phone, b.customer.team ?? ""].some(
          (v) => v.toLowerCase().includes(term)
        )
    );
  }, [db.bookings, q]);

  // Games still to come read soonest first; history and "All" show the newest bookings first.
  const ascending = view === "today" || view === "upcoming";
  const list = useMemo(
    () =>
      filtered
        .filter((b) => inView(b, view, today))
        .sort((a, b) =>
          ascending
            ? startMs(a) - startMs(b)
            : view === "all"
              ? b.createdAt.localeCompare(a.createdAt)
              : startMs(b) - startMs(a)
        ),
    [filtered, view, today, ascending]
  );
  const page = usePagination(list, 15);
  const counts = Object.fromEntries(
    BOOKING_VIEWS.map((v) => [
      v.value,
      filtered.filter((b) => inView(b, v.value, today)).length,
    ])
  ) as Record<BookingView, number>;
  const filtering = !!q.trim();
  const changeView = (v: BookingView) => {
    setView(v);
    page.setPage(1);
  };

  return (
    <div>
      <PageHeader title="Bookings">
        <Link href={ROUTES.adminNewBooking} className={abtn.primary}>
          <Plus className="size-4" aria-hidden />{" "}
          <span className="sm:hidden">{t("New")}</span>
          <span className="hidden sm:inline">{t("New booking")}</span>
        </Link>
      </PageHeader>

      <div className={tableCardClass}>
        <div className="hidden lg:block">
          <ViewPills
            label="Booking views"
            value={view}
            onChange={changeView}
            views={BOOKING_VIEWS.map((v) => ({
              ...v,
              count: v.group === 0 ? counts[v.value] : undefined,
            }))}
          />
        </div>

        <div className="flex flex-col gap-2 border-b border-neutral-100 p-3 sm:flex-row sm:p-4">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              page.setPage(1);
            }}
            placeholder="Search name, phone or code"
          />
          {/* Phones and tablets: the views live here instead of the pill row. */}
          <div className="sm:w-56 lg:hidden">
            <ToolbarSelect
              label="Booking views"
              value={view}
              active={view !== "all"}
              onChange={changeView}
              options={BOOKING_VIEWS.map((v) => ({
                value: v.value,
                label: `${t(v.label)} (${counts[v.value]})`,
              }))}
            />
          </div>
        </div>

        {list.length === 0 ? (
          <Empty
            icon={ClipboardList}
            title={
              filtering
                ? "No bookings match"
                : view === "all"
                  ? "No bookings yet"
                  : t("Nothing in “{view}”", {
                      view: t(
                        BOOKING_VIEWS.find((v) => v.value === view)?.label ?? ""
                      ),
                    })
            }
            text={
              filtering
                ? "Try another search."
                : view === "all"
                  ? "New bookings will show up here."
                  : "Pick another view."
            }
          >
            {filtering && (
              <button
                onClick={() => setQ("")}
                className={cn(abtn.outline, "mt-2")}
              >
                {t("Clear search")}
              </button>
            )}
          </Empty>
        ) : (
          <>
            <ul className="divide-y divide-neutral-100 lg:hidden">
              {page.rows.map((b) => (
                <BookingListItem key={b.id} b={b} phase={phaseOf(b, now)} />
              ))}
            </ul>

            <div className="hidden overflow-x-auto lg:block">
              {/* Proportional column widths so wide screens share the extra space instead of stretching one column. */}
              <table className="w-full min-w-[820px] table-fixed text-sm">
                <colgroup>
                  <col className="w-[32%]" />
                  <col className="w-[22%]" />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead className={table.thead}>
                  <tr>
                    <th className="py-2.5 pl-4 pr-3">{t("Customer")}</th>
                    <th className="px-3 py-2.5">{t("Slot")}</th>
                    <th className="px-3 py-2.5">{t("Status")}</th>
                    <th className="px-3 py-2.5 text-right">{t("Payment")}</th>
                    <th className="py-2.5 pr-4">
                      <span className="sr-only">{t("Actions")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {page.rows.map((b) => (
                    <BookingTableRow
                      key={b.id}
                      b={b}
                      today={today}
                      phase={phaseOf(b, now)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <Pager {...page} noun="bookings" />
      </div>
    </div>
  );
}
