import type {Match} from "./Match.ts";

export interface Prediction {
    id: number;
    match: Match;
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    predictedOutcome: string;
    modelVersion: string;
    generatedAt: string;
}