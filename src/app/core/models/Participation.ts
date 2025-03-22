// TODO: create here a typescript interface for a participation
/*
example of participation:
{
    id: 1,
    year: 2012,
    city: "Londres",
    medalsCount: 28,
    athleteCount: 372
}
*/
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

interface SeriesData {
  name: string;  // Année sous forme de string
  value: number; // Nombre de médailles
}