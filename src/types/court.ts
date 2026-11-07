/** TurfHub is a football-only venue; kept as a type so a sport can be added later. */
export type Sport = "football";

export type Court = {
  id: string;
  name: string;
  sport: Sport;
  surface: string;
  indoor: boolean;
  size: string;
  image: string;
  /** Per hour, before the evening peak starts. */
  price: number;
  peakPrice: number;
  players: string;
  rating: number;
  active: boolean;
  features: string[];
  description: string;
};
