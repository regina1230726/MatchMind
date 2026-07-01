import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Prediction } from "../types/Prediction";

export default function PredictionsPage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    useEffect(() => {
        api.get("/predictions")
            .then(response => setPredictions(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <header className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] app-kicker">
                        AI Predictions
                    </p>

                    <h1 className="text-5xl font-black tracking-tight text-white">
                        Predictions
                    </h1>

                    <p className="mt-3 text-lg app-muted">
                        Model probabilities for each World Cup match.
                    </p>
                </div>

                <div className="hidden rounded-2xl app-card px-5 py-3 text-sm app-muted md:block">
                    {predictions.length} predictions available
                </div>
            </header>

            <section className="space-y-5">
                {predictions.map(prediction => (
                    <PredictionCard
                        key={prediction.id}
                        prediction={prediction}
                    />
                ))}
            </section>
        </div>
    );
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
    const match = prediction.match;
    const date = new Date(match.matchDate);

    return (
        <Link
            to={`/matches/${match.id}`}
            className="grid gap-8 rounded-2xl app-card app-card-hover p-6 xl:grid-cols-[180px_1fr_360px]"
        >
            <div>
                <p className="text-sm app-muted">
                    {date.toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                    {date.toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>

                <p className="mt-1 text-sm app-muted">
                    {match.stage}
                </p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                <TeamMini
                    name={match.homeTeam.name}
                    flagUrl={match.homeTeam.flagUrl}
                />

                <div className="rounded-full app-panel px-5 py-2 text-sm font-black app-muted">
                    VS
                </div>

                <TeamMini
                    name={match.awayTeam.name}
                    flagUrl={match.awayTeam.flagUrl}
                    alignRight
                />
            </div>

            <div className="space-y-4">
                <PredictionBar
                    label={`${match.homeTeam.name} win`}
                    value={prediction.homeWinProbability}
                />

                <PredictionBar
                    label="Draw"
                    value={prediction.drawProbability}
                />

                <PredictionBar
                    label={`${match.awayTeam.name} win`}
                    value={prediction.awayWinProbability}
                />

                <div className="pt-1 text-right">
                    <span className="rounded-full app-chip px-4 py-1 text-xs font-semibold">
                        {prediction.predictedOutcome.replace("_", " ")}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function TeamMini({
                      name,
                      flagUrl,
                      alignRight = false,
                  }: {
    name: string;
    flagUrl: string;
    alignRight?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-4 ${
                alignRight ? "justify-end text-right" : "justify-start"
            }`}
        >
            {!alignRight && (
                <img
                    src={flagUrl}
                    alt={name}
                    className="h-14 w-20 rounded-xl object-cover shadow-lg"
                />
            )}

            <h2 className="text-xl font-black text-white">
                {name}
            </h2>

            {alignRight && (
                <img
                    src={flagUrl}
                    alt={name}
                    className="h-14 w-20 rounded-xl object-cover shadow-lg"
                />
            )}
        </div>
    );
}

function PredictionBar({
                           label,
                           value,
                       }: {
    label: string;
    value: number;
}) {
    const percentage = Math.round(value * 100);

    return (
        <div>
            <div className="mb-2 flex justify-between gap-4 text-sm">
                <span className="app-muted">
                    {label}
                </span>

                <span className="font-black app-kicker">
                    {percentage}%
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full app-progress-bg">
                <div
                    className="h-full rounded-full app-progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}