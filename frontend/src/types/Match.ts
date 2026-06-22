import type {Team} from "./Team.ts";

export interface Match {
    id: number;
    matchDate: string;
    stage: string;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
}
