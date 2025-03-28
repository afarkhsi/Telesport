import { SeriesData } from "./SeriesData";

export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
  name: string;
  series: SeriesData[];
  totalAthletes: number;
  totalMedals: number;
}


