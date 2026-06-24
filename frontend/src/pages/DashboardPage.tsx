import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Match } from "../types/Match";
import type { Prediction } from "../types/Prediction";
import type { Team } from "../types/Team";

export default function DashboardPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        Promise.all([
            api.get("/matches"),
            api.get("/predictions"),
            api.get("/teams"),
        ])
            .then(([matchesRes, predictionsRes, teamsRes]) => {
                setMatches(matchesRes.data);
                setPredictions(predictionsRes.data);
                setTeams(teamsRes.data);
            })
            .catch(error => console.error(error));
    }, []);

    const upcomingMatches = matches.filter(match => match.status === "SCHEDULED").length;
    const finishedMatches = matches.filter(match => match.status === "FINISHED").length;
    const predictionCoverage = matches.length
        ? Math.round((predictions.length / matches.length) * 100)
        : 0;

    return (
        <div>
            <header className="mb-10">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                    Overview
                </p>

                <h1 className="text-5xl font-black tracking-tight">
                    Dashboard
                </h1>

                <p className="mt-3 text-lg text-slate-400">
                    General overview of matches, teams and AI predictions.
                </p>
            </header>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Matches" value={matches.length} />
                <StatCard label="Upcoming" value={upcomingMatches} />
                <StatCard label="Finished" value={finishedMatches} />
                <StatCard label="Teams" value={teams.length} />
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black">
                                Prediction Coverage
                            </h2>
                            <p className="text-sm text-slate-400">
                                Percentage of matches with available predictions.
                            </p>
                        </div>

                        <span className="text-3xl font-black text-emerald-400">
                            {predictionCoverage}%
                        </span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500"
                            style={{ width: `${predictionCoverage}%` }}
                        />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <MiniStat label="Predictions" value={predictions.length} />
                        <MiniStat label="Missing" value={matches.length - predictions.length} />
                        <MiniStat label="Model" value="v1.0" />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
                    <h2 className="text-2xl font-black">
                        Match Status
                    </h2>

                    <div className="mt-6 space-y-5">
                        <StatusBar label="Scheduled" value={upcomingMatches} total={matches.length} />
                        <StatusBar label="Finished" value={finishedMatches} total={matches.length} />
                    </div>
                </div>
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
                <h2 className="text-2xl font-black">Recent Predictions</h2>

                <div className="mt-6 space-y-4">
                    {predictions.slice(0, 3).map(prediction => (
                        <div
                            key={prediction.id}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                        >
                            <div>
                                <p className="font-bold">
                                    {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {prediction.match.stage}
                                </p>
                            </div>

                            <span className="rounded-full bg-violet-500/10 px-4 py-1 text-sm font-semibold text-violet-300">
                                {prediction.predictedOutcome.replace("_", " ")}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </p>
            <p className="mt-4 text-4xl font-black text-white">
                {value}
            </p>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black">{value}</p>
        </div>
    );
}

function StatusBar({ label, value, total }: { label: string; value: number; total: number }) {
    const percentage = total ? Math.round((value / total) * 100) : 0;

    return (
        <div>
            <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="font-bold">{value}</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}