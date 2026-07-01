import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { Match } from "../types/Match";
import type { Prediction } from "../types/Prediction";

export default function MatchDetailsPage() {
    const { id } = useParams();

    const [match, setMatch] = useState<Match | null>(null);
    const [prediction, setPrediction] = useState<Prediction | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/matches/${id}`)
            .then(response => setMatch(response.data))
            .catch(error => console.error(error));

        api.get(`/predictions/match/${id}`)
            .then(response => setPrediction(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!match) {
        return <p className="app-muted">Loading match...</p>;
    }

    const date = new Date(match.matchDate);

    return (
        <div>
            <Link
                to="/matches"
                className="mb-5 inline-block text-sm font-semibold app-kicker hover:text-[#BBE1FA]"
            >
                ← Back to matches
            </Link>

            <header className="mb-6">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] app-kicker">
                    Match Details
                </p>

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white">
                            {match.homeTeam.name} vs {match.awayTeam.name}
                        </h1>

                        <p className="mt-2 app-muted">
                            {match.stage} • {date.toLocaleDateString("pt-PT")} •{" "}
                            {date.toLocaleTimeString("pt-PT", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>

                    <span className="rounded-full app-chip px-4 py-1 text-sm font-semibold">
                        {match.status}
                    </span>
                </div>
            </header>

            <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="grid gap-5">
                    <CompactTeamPanel
                        name={match.homeTeam.name}
                        code={match.homeTeam.code}
                        flagUrl={match.homeTeam.flagUrl}
                        groupName={match.homeTeam.groupName}
                        fifaRanking={match.homeTeam.fifaRanking}
                    />

                    <CompactTeamPanel
                        name={match.awayTeam.name}
                        code={match.awayTeam.code}
                        flagUrl={match.awayTeam.flagUrl}
                        groupName={match.awayTeam.groupName}
                        fifaRanking={match.awayTeam.fifaRanking}
                    />
                </div>

                <section className="rounded-3xl app-card p-7">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white">
                            Prediction
                        </h2>

                        <p className="text-sm app-muted">
                            Model probabilities for this match.
                        </p>
                    </div>

                    {prediction ? (
                        <div className="space-y-5">
                            <ProbabilityBar
                                label={`${match.homeTeam.name} win`}
                                value={prediction.homeWinProbability}
                            />

                            <ProbabilityBar
                                label="Draw"
                                value={prediction.drawProbability}
                            />

                            <ProbabilityBar
                                label={`${match.awayTeam.name} win`}
                                value={prediction.awayWinProbability}
                            />

                            <div className="mt-6 rounded-2xl app-panel p-5">
                                <p className="text-sm app-muted">
                                    Predicted outcome
                                </p>

                                <p className="mt-1 text-2xl font-black app-kicker">
                                    {prediction.predictedOutcome.replace("_", " ")}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="app-muted">
                            No prediction available for this match yet.
                        </p>
                    )}
                </section>
            </section>
        </div>
    );
}

function CompactTeamPanel({
                              name,
                              code,
                              flagUrl,
                              groupName,
                              fifaRanking,
                          }: {
    name: string;
    code: string;
    flagUrl: string;
    groupName: string;
    fifaRanking: number;
}) {
    return (
        <div className="rounded-3xl app-card p-6">
            <div className="flex items-center gap-5">
                <img
                    src={flagUrl}
                    alt={name}
                    className="h-20 w-28 rounded-2xl object-cover shadow-lg"
                />

                <div>
                    <h2 className="text-3xl font-black text-white">
                        {name}
                    </h2>

                    <p className="mt-1 app-muted">
                        {code}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
                <InfoBox label="Group" value={groupName} />
                <InfoBox label="FIFA Rank" value={`#${fifaRanking}`} />
            </div>
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl app-panel p-4">
            <p className="text-xs uppercase tracking-widest app-muted">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}

function ProbabilityBar({ label, value }: { label: string; value: number }) {
    const percentage = Math.round(value * 100);

    return (
        <div>
            <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold app-muted">
                    {label}
                </span>

                <span className="font-bold text-white">
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