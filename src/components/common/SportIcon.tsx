import { Trophy } from "lucide-react";
import { GiSoccerBall } from "react-icons/gi";
import { cn } from "@/src/lib/utils";
import type { IconType, Sport } from "@/src/types";

const sportIcons: Record<Sport, IconType> = {
  football: GiSoccerBall,
};

export function SportIcon({
  sport,
  className,
}: {
  sport: Sport;
  className?: string;
}) {
  const Icon = sportIcons[sport] ?? Trophy;
  return <Icon className={cn("size-4", className)} />;
}
