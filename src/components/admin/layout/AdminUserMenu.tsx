"use client";

import Link from "next/link";
import { ExternalLink, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ROUTES } from "@/src/constants";
import { useT } from "@/src/lib/i18n";

/** "Front Desk" avatar in the top bar, with links to the site and the demo reset. */
export function AdminUserMenu({
  venueName,
  onReset,
}: {
  venueName: string;
  onReset: () => void;
}) {
  const t = useT();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
        <span className="hidden text-right md:block">
          <span className="block text-sm font-semibold text-neutral-900">
            {t("Front Desk")}
          </span>
          <span className="block text-xs text-neutral-500">{venueName}</span>
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
          FD
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-md"
      >
        <DropdownMenuLabel>
          <span className="block text-sm">{t("Front Desk")}</span>
          <span className="block text-xs font-normal text-neutral-500">
            {venueName}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTES.home} target="_blank">
            <ExternalLink /> {t("View booking site")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={onReset}
        >
          <RotateCcw /> {t("Reset demo data")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
