import { EventEntry } from "./EventEntry";

export interface EventData {
    series: EventEntry;
    entries: EventEntry[];
    event: MouseEvent; // ou un type d'événement plus spécifique, selon le contexte
}

