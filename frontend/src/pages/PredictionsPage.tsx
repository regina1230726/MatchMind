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
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                        AI Predictions
                    </p>

                    <h1 className="text-5xl font-black tracking-tight">
                        Predictions
                    </h1>

                    <p className="mt-3 text-lg text-slate-400">
                        Model probabilities for each World Cup match.
                    </p>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 md:block">
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
            className="grid gap-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-violet-400/40 xl:grid-cols-[180px_1fr_360px]"
        >
            <div>
                <p className="text-sm text-slate-400">
                    {date.toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </p>

                <p className="mt-2 text-2xl font-black">
                    {date.toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                    {match.stage}
                </p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                <TeamMini
                    name={match.homeTeam.name}
                    flagUrl={match.homeTeam.flagUrl}
                />

                <div className="rounded-full border border-white/10 bg-slate-950/50 px-5 py-2 text-sm font-black text-slate-300">
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
                    color="emerald"
                />

                <PredictionBar
                    label="Draw"
                    value={prediction.drawProbability}
                    color="yellow"
                />

                <PredictionBar
                    label={`${match.awayTeam.name} win`}
                    value={prediction.awayWinProbability}
                    color="violet"
                />

                <div className="pt-1 text-right">
                    <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-400">
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

            <h2 className="text-xl font-black">
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
                           color,
                       }: {
    label: string;
    value: number;
    color: "emerald" | "yellow" | "violet";
}) {
    const percentage = Math.round(value * 100);

    const colors = {
        emerald: "from-emerald-400 to-emerald-500 text-emerald-400",
        yellow: "from-yellow-300 to-yellow-500 text-yellow-300",
        violet: "from-violet-400 to-violet-600 text-violet-400",
    };

    return (
        <div>
            <div className="mb-2 flex justify-between gap-4 text-sm">
                <span className="text-slate-300">
                    {label}
                </span>

                <span className={`font-black ${colors[color].split(" ").at(-1)}`}>
                    {percentage}%
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}